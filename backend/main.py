from fastapi import FastAPI, File, UploadFile, HTTPException
  from fastapi.middleware.cors import CORSMiddleware
  from fastapi.responses import JSONResponse
  import io
  import pandas as pd
  import numpy as np
  import time
  import os
  from models import WorldModelPipeline, DEVICE, topology_manager # Imported topology_manager
  from data_generator import generate_sample_dataset, generate_sample_csv
  from typing import List, Dict, Any

  # Initialize FastAPI app
  app = FastAPI(
      title="Cyber Threat World Model API",
      description="LSTM-based predictive cyber defence system with Proactive Isolation",
      version="2.0.0" # Upgraded version
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
      global model_loaded, benchmark_metrics, sample_predictions
      if not model_loaded:
          try:
              X_train_raw, y_train, X_test_raw, y_test = generate_sample_dataset(num_samples=500)
              X_train = pipeline.extract_features(X_train_raw)
              X_test = pipeline.extract_features(X_test_raw)
              pipeline.train(X_train, y_train, epochs=15, batch_size=32)

              X_test_scaled = pipeline.scaler.transform(X_test.values)
              y_test_arr = y_test.values if hasattr(y_test, 'values') else y_test
              X_test_seq, y_test_seq = pipeline.create_sequences(X_test_scaled, y_test_arr, seq_len=5)
              if len(X_test_seq) > 0:
                  import torch
                  X_tensor = torch.from_numpy(X_test_seq).float().to(DEVICE)
                  with torch.no_grad():
                      lstm_preds, _ = pipeline.model(X_tensor)
                      lstm_preds = lstm_preds.cpu().numpy()
                  X_flat = X_test_seq.reshape(X_test_seq.shape[0], -1)
                  baseline_preds = pipeline.baseline_model.predict_proba(X_flat)[:, 1]
                  benchmark_metrics = pipeline.get_benchmark_metrics(y_test_seq, lstm_preds, baseline_preds)
              pipeline.save("models")
              model_loaded = True
          except Exception as e:
              print(f"Error training model: {e}")

  @app.get("/")
  async def root():
      return {"status": "online", "service": "Cyber Threat World Model API", "version": "2.0.0"}

  # --- NEW ENTERPRISE ENDPOINTS ---

  @app.get("/network-state")
  async def get_network_state():
      """Returns the current state of isolated nodes"""
      return {
          "status": "success",
          "isolated_nodes": list(topology_manager.isolated_nodes),
          "total_isolated": len(topology_manager.isolated_nodes)
      }

  @app.post("/isolate")
  async def isolate_node(asset: Dict[str, str]):
      """Isolate a predicted target asset to block the attack"""
      asset_name = asset.get("name")
      if not asset_name:
          raise HTTPException(status_code=400, detail="Asset name required")

      topology_manager.isolate_node(asset_name)
      return {"status": "success", "message": f"Asset {asset_name} has been isolated."}

  @app.post("/release")
  async def release_node(asset: Dict[str, str]):
      """Release a node from isolation"""
      asset_name = asset.get("name")
      topology_manager.release_node(asset_name)
      return {"status": "success", "message": f"Asset {asset_name} is now online."}

  # --- MODIFIED PREDICT ENDPOINT ---

  @app.post("/predict")
  async def predict(file: UploadFile = File(...)):
      if not model_loaded:
          raise HTTPException(status_code=503, detail="Model not ready")

      try:
          contents = await file.read()
          df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
          if df.empty: raise HTTPException(status_code=400, detail="CSV is empty")
          if len(df) < 5: raise HTTPException(status_code=400, detail="Min 5 flows required")

          start_time = time.time()
          features = pipeline.extract_features(df)
          predictions = pipeline.predict(features, seq_len=5, k_steps=3)
          inference_time = time.time() - start_time

          # World Model Logic: Map MITRE stages to Assets
          top_stage = predictions['mitre_stages'][0]
          target_asset = topology_manager.get_target_asset(top_stage)

          # CHECK IF THE PREDICTED TARGET IS ALREADY ISOLATED
          is_blocked = topology_manager.is_isolated(target_asset)
          verdict = "BLOCKED" if is_blocked else "ALLOWED"

          avg_infiltration = float(np.mean(predictions['lstm_probabilities']))
          max_infiltration = float(np.max(predictions['lstm_probabilities']))
          stage_distribution = {}
          for stage in predictions['mitre_stages']:
              stage_distribution[stage] = stage_distribution.get(stage, 0) + 1

          return {
              "status": "success",
              "verdict": verdict,
              "predicted_target": target_asset,
              "predictions": {
                  "lstm_probabilities": predictions['lstm_probabilities'],
                  "mitre_stages": predictions['mitre_stages'],
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
      except Exception as e:
          raise HTTPException(status_code=500, detail=str(e))

  @app.get("/benchmark")
  async def get_benchmark():
      global benchmark_metrics
      if benchmark_metrics is None:
          raise HTTPException(status_code=503, detail="Benchmark data not available")
      return {"status": "success", "metrics": benchmark_metrics}

  @app.get("/model-info")
  async def get_model_info():
      return {
          "status": "success",
          "model_type": "LSTM (Enterprise Edition)",
          "mitre_stages": ["Reconnaissance", "Initial Access", "Lateral Movement", "Command & Control", "Exfiltration"],
          "device": str(DEVICE) if pipeline.model else "cpu"
      }

  if __name__ == "__main__":
      import uvicorn
      uvicorn.run(app, host="0.0.0.0", port=8000)
 from fastapi import FastAPI, HTTPException
  from fastapi.middleware.cors import CORSMiddleware
  from models import engine, DEVICE
  import pandas as pd

  app = FastAPI(title="CyberWorld Simulation API")

  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )

  @app.get("/state")
  async def get_state():
      """Returns the full current state of the world"""
      return {
          "attacker_position": engine.attacker_pos,
          "isolated_nodes": list(engine.isolated_nodes),
          "history": engine.history,
          "blocked_attacks": engine.blocked_count,
          "topology": engine.topology
      }

  @app.post("/simulate")
  async def simulate_move():
      """Triggers a movement in the world model"""
      result = engine.move_attacker()
      return result

  @app.post("/isolate")
  async def isolate_node(node_name: str):
      """Isolates a specific node"""
      engine.isolate(node_name)
      return {"status": "success", "message": f"Node {node_name} isolated."}

  @app.post("/reset")
  async def reset_sim():
      """Resets the simulation"""
      engine.reset()
      return {"status": "success", "message": "Simulation reset."}
