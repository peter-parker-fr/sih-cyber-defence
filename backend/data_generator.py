import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import io

def generate_network_flows(num_flows: int, anomaly_ratio: float = 0.2) -> pd.DataFrame:
    """Generate synthetic network flow data"""
    np.random.seed(42)
    
    flows = []
    
    # Normal traffic patterns
    normal_ips = [f"192.168.1.{i}" for i in range(1, 50)]
    dest_ips = [f"10.0.0.{i}" for i in range(1, 100)]
    
    # Suspicious ports
    suspicious_ports = [22, 445, 135, 139, 3389, 5985, 5986]
    normal_ports = [80, 443, 8080, 53]
    
    for i in range(num_flows):
        is_anomaly = np.random.random() < anomaly_ratio
        
        if is_anomaly:
            # Anomalous pattern
            src_ip = np.random.choice(normal_ips[:10])
            dst_ip = np.random.choice(dest_ips[:20])
            dst_port = np.random.choice(suspicious_ports)
            protocol = "TCP"
            bytes_val = int(np.random.exponential(5000))
            packets = int(np.random.exponential(100))
            duration = np.random.uniform(10, 300)
            tcp_flags = "S" if np.random.random() > 0.3 else "SA"
            iat_mean = np.random.uniform(10, 100)
            iat_var = np.random.uniform(50, 500)
            iat_max = np.random.uniform(200, 1000)
        else:
            # Normal pattern
            src_ip = np.random.choice(normal_ips)
            dst_ip = np.random.choice(dest_ips)
            dst_port = np.random.choice(normal_ports)
            protocol = np.random.choice(["TCP", "UDP"])
            bytes_val = int(np.random.normal(10000, 5000))
            packets = int(np.random.normal(50, 20))
            duration = np.random.uniform(1, 60)
            tcp_flags = "SA" if protocol == "TCP" else "-"
            iat_mean = np.random.uniform(0.1, 10)
            iat_var = np.random.uniform(0.1, 50)
            iat_max = np.random.uniform(10, 100)
        
        flows.append({
            "src_ip": src_ip,
            "dst_ip": dst_ip,
            "src_port": np.random.randint(1024, 65535),
            "dst_port": dst_port,
            "protocol": protocol,
            "bytes": max(0, bytes_val),
            "packets": max(1, packets),
            "duration": max(0.1, duration),
            "tcp_flags": tcp_flags,
            "iat_mean": iat_mean,
            "iat_var": iat_var,
            "iat_max": iat_max,
            "bidirectional_ratio": np.random.uniform(0.1, 1.0),
            "label": 1 if is_anomaly else 0
        })
    
    return pd.DataFrame(flows)

def generate_sample_dataset(num_samples: int = 500, test_split: float = 0.2):
    """Generate train/test split datasets"""
    df = generate_network_flows(num_samples)
    
    # Shuffle and split
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    split_idx = int(len(df) * (1 - test_split))
    
    train_df = df[:split_idx]
    test_df = df[split_idx:]
    
    X_train = train_df.drop('label', axis=1)
    y_train = train_df['label'].values
    
    X_test = test_df.drop('label', axis=1)
    y_test = test_df['label'].values
    
    return X_train, y_train, X_test, y_test

def generate_sample_csv(num_rows: int = 100) -> str:
    """Generate sample CSV string for download"""
    df = generate_network_flows(num_rows)
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    return csv_buffer.getvalue()

def load_cicids_subset(filepath: str, num_rows: int = 1000):
    """
    Load subset of CIC-IDS-2018 or similar dataset
    Expected to have columns like: src_ip, src_port, dst_ip, dst_port, protocol, 
                                   flow_duration, total_fwd_packets, total_bwd_packets, etc.
    """
    try:
        df = pd.read_csv(filepath, nrows=num_rows)
        
        # Map to our standard format if needed
        required_cols = ['src_ip', 'dst_ip', 'src_port', 'dst_port', 'protocol', 
                        'bytes', 'packets', 'duration', 'tcp_flags', 'iat_mean', 'iat_var', 'iat_max']
        
        # Check if we need to remap columns
        if not all(col in df.columns for col in required_cols):
            # Try to infer mapping
            print("Remapping columns...")
            # This is a placeholder - adjust based on actual dataset structure
        
        return df
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return None

if __name__ == "__main__":
    # Test data generation
    X_train, y_train, X_test, y_test = generate_sample_dataset(100)
    print(f"Train shape: {X_train.shape}, Test shape: {X_test.shape}")
    print(f"Anomaly ratio: {y_train.mean():.2%}")
    print("\nSample flows:")
    print(X_train.head())
