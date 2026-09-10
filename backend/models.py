import os
import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Tuple, Any
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, precision_score, recall_score, confusion_matrix
import shap
import pickle

# Set device
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

class LSTMWorldModel(nn.Module):
    """LSTM-based world model for network state prediction"""
    def __init__(self, input_size: int, hidden_size: int = 64, num_layers: int = 2, dropout: float = 0.2):
        super(LSTMWorldModel, self).__init__()
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout
        )
        self.fc = nn.Linear(hidden_size, 1)
        self.sigmoid = nn.Sigmoid()
        self.attention = nn.Linear(hidden_size, 1)
        
    def forward(self, x: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Args:
            x: (batch_size, seq_len, input_size)
        Returns:
            predictions: (batch_size,)
            attention_weights: (batch_size, seq_len)
        """
        lstm_out, _ = self.lstm(x)  # (batch_size, seq_len, hidden_size)
        
        # Attention mechanism
        attention_logits = self.attention(lstm_out)  # (batch_size, seq_len, 1)
        attention_weights = torch.softmax(attention_logits, dim=1)  # (batch_size, seq_len, 1)
        
        # Weighted sum
        context = torch.sum(attention_weights * lstm_out, dim=1)  # (batch_size, hidden_size)
        
        # Output
        logits = self.fc(context)  # (batch_size, 1)
        predictions = self.sigmoid(logits).squeeze(1)  # (batch_size,)
        
        return predictions, attention_weights.squeeze(-1)

class WorldModelPipeline:
    """End-to-end pipeline for cyber threat detection"""
    
    # MITRE ATT&CK stages
    MITRE_STAGES = [
        "Reconnaissance",
        "Initial Access",
        "Lateral Movement",
        "Command & Control",
        "Exfiltration"
    ]
    
    # Feature importance thresholds for stage mapping
    STAGE_THRESHOLDS = {
        "Reconnaissance": {"threshold": 0.2, "indicators": ["port_scan_ratio", "unique_dst_ports", "syn_ratio"]},
        "Initial Access": {"threshold": 0.35, "indicators": ["failed_login_attempts", "exploit_ports", "payload_entropy"]},
        "Lateral Movement": {"threshold": 0.5, "indicators": ["internal_traffic_ratio", "smb_traffic", "lateral_ports"]},
        "Command & Control": {"threshold": 0.65, "indicators": ["c2_ports", "beaconing_pattern", "dns_tunneling"]},
        "Exfiltration": {"threshold": 0.8, "indicators": ["outbound_ratio", "large_flows", "data_volume"]},
    }
    
    def __init__(self, model_path: str = None, scaler_path: str = None, baseline_path: str = None):
        self.model = None
        self.scaler = None
        self.baseline_model = None
        self.feature_names = None
        self.model_path = model_path
        self.scaler_path = scaler_path
        self.baseline_path = baseline_path
        
    def extract_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Extract network flow features from CSV
        Expected columns: src_ip, dst_ip, src_port, dst_port, protocol, 
                         bytes, packets, duration, tcp_flags, iat_mean, iat_var, iat_max
        """
        features = pd.DataFrame()
        
        # Basic flow features
        features['protocol_tcp'] = (df['protocol'].astype(str).str.lower() == 'tcp').astype(float)
        features['protocol_udp'] = (df['protocol'].astype(str).str.lower() == 'udp').astype(float)
        
        # TCP flags analysis
        if 'tcp_flags' in df.columns:
            syn_count = df['tcp_flags'].astype(str).str.contains('S', na=False).astype(float)
            ack_count = df['tcp_flags'].astype(str).str.contains('A', na=False).astype(float)
            fin_count = df['tcp_flags'].astype(str).str.contains('F', na=False).astype(float)
            rst_count = df['tcp_flags'].astype(str).str.contains('R', na=False).astype(float)
            
            features['syn_ratio'] = syn_count / (df['packets'].astype(float) + 1e-6)
            features['ack_ratio'] = ack_count / (df['packets'].astype(float) + 1e-6)
            features['fin_ratio'] = fin_count / (df['packets'].astype(float) + 1e-6)
            features['rst_ratio'] = rst_count / (df['packets'].astype(float) + 1e-6)
            features['syn_without_ack'] = syn_count * (1 - ack_count)
        else:
            features['syn_ratio'] = 0.0
            features['ack_ratio'] = 0.0
            features['fin_ratio'] = 0.0
            features['rst_ratio'] = 0.0
            features['syn_without_ack'] = 0.0
        
        # Flow statistics
        features['bytes_per_packet'] = df['bytes'].astype(float) / (df['packets'].astype(float) + 1e-6)
        features['duration_sec'] = df['duration'].astype(float)
        features['packet_rate'] = df['packets'].astype(float) / (df['duration'].astype(float) + 1e-6)
        
        # IAT statistics
        if 'iat_mean' in df.columns:
            features['iat_mean'] = df['iat_mean'].astype(float)
            features['iat_var'] = df['iat_var'].astype(float).fillna(0)
            features['iat_max'] = df['iat_max'].astype(float).fillna(0)
        else:
            features['iat_mean'] = 0.0
            features['iat_var'] = 0.0
            features['iat_max'] = 0.0
        
        # Port-based features
        features['dst_port'] = df['dst_port'].astype(float)
        features['src_port'] = df['src_port'].astype(float)
        
        # High-risk port detection
        suspicious_ports = [22, 445, 135, 139, 3389, 21, 23, 25, 53, 5985, 5986]
        features['suspicious_port'] = df['dst_port'].astype(float).isin(suspicious_ports).astype(float)
        
        # Bidirectional traffic ratio
        if 'bidirectional_ratio' in df.columns:
            features['bidirectional_ratio'] = df['bidirectional_ratio'].astype(float)
        else:
            features['bidirectional_ratio'] = 0.5
        
        # Normalize port numbers
        features['dst_port_norm'] = features['dst_port'] / 65535.0
        features['src_port_norm'] = features['src_port'] / 65535.0
        
        # Drop port columns (use normalized versions)
        features = features.drop(['dst_port', 'src_port'], axis=1)
        
        self.feature_names = list(features.columns)
        return features.fillna(0)
    
    def create_sequences(self, features: np.ndarray, labels: np.ndarray = None, seq_len: int = 5) -> Tuple[np.ndarray, np.ndarray]:
        """Create sliding window sequences"""
        X, y = [], []
        for i in range(len(features) - seq_len):
            X.append(features[i:i+seq_len])
            if labels is not None:
                y.append(labels[i+seq_len])
        
        return np.array(X), np.array(y) if labels is not None else None
    
    def train(self, features: pd.DataFrame, labels: np.ndarray, epochs: int = 20, batch_size: int = 32):
        """Train LSTM and baseline models"""
        # Scale features
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(features.values)
        
        # Create sequences
        seq_len = 5
        X_seq, y_seq = self.create_sequences(X_scaled, labels, seq_len=seq_len)
        
        # LSTM Model
        self.model = LSTMWorldModel(
            input_size=X_seq.shape[2],
            hidden_size=64,
            num_layers=2,
            dropout=0.2
        ).to(DEVICE)
        
        optimizer = torch.optim.Adam(self.model.parameters(), lr=0.001)
        criterion = nn.BCELoss()
        
        X_train = torch.from_numpy(X_seq).float().to(DEVICE)
        y_train = torch.from_numpy(y_seq).float().to(DEVICE)
        
        dataset = TensorDataset(X_train, y_train)
        loader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
        
        self.model.train()
        for epoch in range(epochs):
            total_loss = 0
            for batch_X, batch_y in loader:
                optimizer.zero_grad()
                preds, _ = self.model(batch_X)
                loss = criterion(preds, batch_y)
                loss.backward()
                optimizer.step()
                total_loss += loss.item()
            
            if (epoch + 1) % 5 == 0:
                print(f"Epoch {epoch+1}/{epochs}, Loss: {total_loss/len(loader):.4f}")
        
        # Train baseline (Logistic Regression)
        X_flat = X_seq.reshape(X_seq.shape[0], -1)
        self.baseline_model = LogisticRegression(max_iter=1000, random_state=42)
        self.baseline_model.fit(X_flat, y_seq)
        
        print("Training complete!")
    
    def predict(self, features: pd.DataFrame, seq_len: int = 5, k_steps: int = 3) -> Dict[str, Any]:
        """
        Predict infiltration probability and MITRE ATT&CK stages for k steps ahead
        """
        if self.model is None or self.scaler is None:
            raise ValueError("Model not trained. Call train() first.")
        
        self.model.eval()
        
        # Scale and create sequences
        X_scaled = self.scaler.transform(features.values)
        X_seq, _ = self.create_sequences(X_scaled, seq_len=seq_len)
        
        predictions_list = []
        attention_list = []
        top_features_list = []
        stages_list = []
        
        X_tensor = torch.from_numpy(X_seq).float().to(DEVICE)
        
        with torch.no_grad():
            for i in range(len(X_seq)):
                pred, attention = self.model(X_tensor[i:i+1])
                pred_prob = pred.cpu().numpy()[0]
                attention_weights = attention.cpu().numpy()[0]
                
                # Get top contributing features
                top_indices = np.argsort(attention_weights)[-5:][::-1]
                top_features = [(self.feature_names[idx], float(attention_weights[idx])) 
                               for idx in top_indices]
                
                # Map to MITRE stage
                stage = self._predict_stage(pred_prob, top_features)
                
                predictions_list.append(pred_prob)
                attention_list.append(attention_weights)
                top_features_list.append(top_features)
                stages_list.append(stage)
        
        # Get baseline predictions
        X_flat = X_seq.reshape(X_seq.shape[0], -1)
        baseline_probs = self.baseline_model.predict_proba(X_flat)[:, 1]
        
        result = {
            "lstm_probabilities": [float(p) for p in predictions_list],
            "baseline_probabilities": [float(p) for p in baseline_probs],
            "mitre_stages": stages_list,
            "top_features": top_features_list,
            "attention_weights": [w.tolist() for w in attention_list],
            "timestamps": [(datetime.now() + timedelta(minutes=i*5)).isoformat() for i in range(len(predictions_list))],
            "feature_names": self.feature_names
        }
        
        return result
    
    def _predict_stage(self, prob: float, top_features: List[Tuple[str, float]]) -> str:
        """Map probability and features to MITRE ATT&CK stage"""
        if prob < 0.3:
            return "Reconnaissance"
        elif prob < 0.5:
            return "Initial Access"
        elif prob < 0.65:
            return "Lateral Movement"
        elif prob < 0.8:
            return "Command & Control"
        else:
            return "Exfiltration"
    
    def get_benchmark_metrics(self, y_true: np.ndarray, y_lstm: np.ndarray, y_baseline: np.ndarray) -> Dict[str, Any]:
        """Calculate benchmark metrics for both models"""
        y_lstm_binary = (y_lstm > 0.5).astype(int)
        y_baseline_binary = (y_baseline > 0.5).astype(int)
        
        metrics = {
            "lstm": {
                "f1": float(f1_score(y_true, y_lstm_binary)),
                "precision": float(precision_score(y_true, y_lstm_binary)),
                "recall": float(recall_score(y_true, y_lstm_binary)),
                "fpr": float(1 - precision_score(y_true, y_lstm_binary, zero_division=0))
            },
            "baseline": {
                "f1": float(f1_score(y_true, y_baseline_binary)),
                "precision": float(precision_score(y_true, y_baseline_binary)),
                "recall": float(recall_score(y_true, y_baseline_binary)),
                "fpr": float(1 - precision_score(y_true, y_baseline_binary, zero_division=0))
            }
        }
        
        return metrics
    
    def save(self, model_dir: str = "models"):
        """Save trained models"""
        os.makedirs(model_dir, exist_ok=True)
        if self.model:
            torch.save(self.model.state_dict(), os.path.join(model_dir, "lstm_model.pt"))
        if self.scaler:
            with open(os.path.join(model_dir, "scaler.pkl"), 'wb') as f:
                pickle.dump(self.scaler, f)
        if self.baseline_model:
            with open(os.path.join(model_dir, "baseline_model.pkl"), 'wb') as f:
                pickle.dump(self.baseline_model, f)
    
    def load(self, model_dir: str = "models"):
        """Load trained models"""
        model_path = os.path.join(model_dir, "lstm_model.pt")
        scaler_path = os.path.join(model_dir, "scaler.pkl")
        baseline_path = os.path.join(model_dir, "baseline_model.pkl")
        
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            # Try to load
            try:
                with open(scaler_path, 'rb') as f:
                    self.scaler = pickle.load(f)
                self.model = LSTMWorldModel(input_size=16, hidden_size=64, num_layers=2)
                self.model.load_state_dict(torch.load(model_path, map_location=DEVICE))
                self.model.to(DEVICE)
            except:
                return False
            
            if os.path.exists(baseline_path):
                with open(baseline_path, 'rb') as f:
                    self.baseline_model = pickle.load(f)
            
            return True
        return False

  class TopologyManager:
      """Maps AI predictions to real-world network assets"""
      def __init__(self):
          # This mapping connects MITRE stages to likely target assets
          self.stage_to_asset = {
              "Reconnaissance": "DMZ_Web_Server",
              "Initial Access": "VPN_Gateway",
              "Lateral Movement": "Internal_App_Server",
              "Command & Control": "Active_Directory",
              "Exfiltration": "SQL_Database"
          }
          self.isolated_nodes = set()

      def get_target_asset(self, stage):
          return self.stage_to_asset.get(stage, "Unknown Asset")

      def isolate_node(self, asset_name):
          self.isolated_nodes.add(asset_name)
          return True

      def release_node(self, asset_name):
          self.isolated_nodes.discard(asset_name)
          return True

      def is_isolated(self, asset_name):
          return asset_name in self.isolated_nodes

  # Initialize a global topology manager
  topology_manager = TopologyManager()
