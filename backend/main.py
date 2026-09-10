from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import io
import pandas as pd
import numpy as np
import time
import os
from models import WorldModelPipeline, DEVICE
from data_generator import generate_sample_dataset, generate_sample_csv
from typing import List, Dict, Any

# Initialize FastAPI app
app = FastAPI(
    title="Cyber Threat World Model API",
    description="LSTM-based predictive cyber defence system",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize pipeline
pipeline = WorldModelPipeline()
model_loaded = pipeline.load("models")

# Global cache for metrics
benchmark_metrics = None
sample_predictions = None

@app.on_event("startup")
async def startup_event():
    """Initialize models on startup"""
    global model_loaded, benchmark_metrics, sample_predictions

    if not model_loaded:
        print("No trained model found. Training on sample data...")
        try:
            X_train_raw, y_train, X_test_raw, y_test = generate_sample_dataset(num_samples=500)

            # FIX: extract numeric features (drops src_ip/dst_ip, encodes flags/ports/etc.)
            # before anything touches the scaler or the model.
            X_train = pipeline.extract_features(X_train_raw)
            X_test = pipeline.extract_features(X_test_raw)

            # Train model
            pipeline.train(X_train, y_train, epochs=15, batch_size=32)

            # Calculate benchmark metrics
            X_test_scaled = pipeline.scaler.transform(X_test.values)
            y_test_arr = y_test.values if hasattr(y_test, 'values') else y_test
            X_test_seq, y_test_seq = pipeline.create_sequences(X_test_scaled, y_test_arr, seq_len=5)
            if len(X_test_seq) > 0:
                import torch
                # FIX: pipeline.model.device doesn't exist on a plain nn.Module.
                # Use the DEVICE constant imported from models.py instead.
                X_tensor = torch.from_numpy(X_test_seq).float().to(DEVICE)

                with torch.no_grad():
                    lstm_preds, _ = pipeline.model(X_tensor)
                    lstm_preds = lstm_preds.cpu().numpy()

                X_flat = X_test_seq.reshape(X_test_seq.shape[0], -1)
                baseline_preds = pipeline.baseline_model.predict_proba(X_flat)[:, 1]

                benchmark_metrics = pipeline.get_benchmark_metrics(y_test_seq, lstm_preds, baseline_preds)
                print(f"Benchmark Metrics: {benchmark_metrics}")

            # Save models
            pipeline.save("models")
            model_loaded = True

        except Exception as e:
            print(f"Error training model: {e}")
            import traceback
            traceback.print_exc()

@app.get("/")
async def root():
    """API health check"""
    return {
        "status": "online",
        "service": "Cyber Threat World Model API",
        "model_loaded": model_loaded,
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_ready": model_loaded,
        "timestamp": str(pd.Timestamp.now())
    }

@app.get("/sample-data")
async def get_sample_data():
    """Download sample dataset"""
    try:
        csv_content = generate_sample_csv()
        return {
            "status": "success",
            "data": csv_content[:50],  # First 50 rows as preview
            "total_rows": len(csv_content.split('\n')),
            "filename": "sample_network_traffic.csv"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Predict infiltration probability and MITRE ATT&CK stages

    Expected CSV format:
    src_ip, dst_ip, src_port, dst_port, protocol, bytes, packets, duration, tcp_flags, iat_mean, iat_var, iat_max
    """
    if not model_loaded:
        raise HTTPException(status_code=503, detail="Model not ready")

    try:
        # Read uploaded file
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))

        # Validate
        if df.empty:
            raise HTTPException(status_code=400, detail="CSV is empty")

        if len(df) < 5:
            raise HTTPException(status_code=400, detail="Minimum 5 flows required for prediction")

        # Extract features and predict
        start_time = time.time()
        features = pipeline.extract_features(df)
        predictions = pipeline.predict(features, seq_len=5, k_steps=3)
        inference_time = time.time() - start_time

        # Aggregate predictions
        avg_infiltration = float(np.mean(predictions['lstm_probabilities']))
        max_infiltration = float(np.max(predictions['lstm_probabilities']))
        stage_distribution = {}
        for stage in predictions['mitre_stages']:
            stage_distribution[stage] = stage_distribution.get(stage, 0) + 1

        return {
            "status": "success",
            "predictions": {
                "lstm_probabilities": predictions['lstm_probabilities'],
                "baseline_probabilities": predictions['baseline_probabilities'],
                "mitre_stages": predictions['mitre_stages'],
                "timestamps": predictions['timestamps'],
                "average_infiltration_probability": avg_infiltration,
                "max_infiltration_probability": max_infiltration,
                "stage_distribution": stage_distribution
            },
            "explainability": {
                "top_features": predictions['top_features'],
                "feature_names": predictions['feature_names']
            },
            "inference_time_ms": round(inference_time * 1000, 2),
            "flows_analyzed": len(df)
        }

    except pd.errors.ParserError as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV format: {str(e)}")
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# FIX: was @app.post("/benchmark") — the frontend calls this with GET,
# which caused a 405 Method Not Allowed. This just reads cached metrics,
# so GET is the correct verb anyway.
@app.get("/benchmark")
async def get_benchmark():
    """Get benchmark metrics"""
    global benchmark_metrics

    if benchmark_metrics is None:
        raise HTTPException(status_code=503, detail="Benchmark data not available")

    return {
        "status": "success",
        "metrics": benchmark_metrics,
        "timestamp": str(pd.Timestamp.now())
    }

@app.get("/sample-analysis")
async def get_sample_analysis():
    """Get pre-computed analysis on sample data"""
    global sample_predictions

    try:
        if sample_predictions is None:
            # Generate and cache sample predictions
            X_sample_raw, _, _, _ = generate_sample_dataset(num_samples=50)

            # FIX: extract_features() was never called here either — same
            # "raw IP strings hit the scaler" bug as startup_event had.
            features = pipeline.extract_features(X_sample_raw.head(20))
            sample_predictions = pipeline.predict(features, seq_len=5)

            # Add benchmark data
            global benchmark_metrics
            sample_predictions['benchmark'] = benchmark_metrics

        return {
            "status": "success",
            "predictions": sample_predictions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model-info")
async def get_model_info():
    """Get information about the model"""
    return {
        "status": "success",
        "model_type": "LSTM (2 layers, 64 hidden units)",
        "baseline_type": "Logistic Regression",
        "features": pipeline.feature_names,
        "feature_count": len(pipeline.feature_names) if pipeline.feature_names else 0,
        "mitre_stages": [
            "Reconnaissance",
            "Initial Access",
            "Lateral Movement",
            "Command & Control",
            "Exfiltration"
        ],
        # FIX: pipeline.model.device doesn't exist — use DEVICE constant.
        "device": str(DEVICE) if pipeline.model else "cpu"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
