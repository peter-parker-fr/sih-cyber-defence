  import torch
  import torch.nn as nn
  import numpy as np
  import random
  from typing import List, Dict, Any

  DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

  class LSTMWorldModel(nn.Module):
      def __init__(self, input_size, hidden_size=64, num_layers=2, dropout=0.2):
          super(LSTMWorldModel, self).__init__()
          self.lstm = nn.LSTM(input_size, hidden_size, num_layers, dropout=dropout, batch_first=True)
          self.fc = nn.Linear(hidden_size, 5) # 5 MITRE Stages

      def forward(self, x):
          out, _ = self.lstm(x)
          out = self.fc(out[:, -1, :])
          return out

  class SimulationEngine:
      """Handles the real-time state of the network attack"""
      def __init__(self):
          # The Network Topology
          self.topology = {
              'Internet': ['DMZ_Web_Server', 'VPN_Gateway'],
              'DMZ_Web_Server': ['Internet', 'Internal_App_Server', 'Log_Collector'],
              'VPN_Gateway': ['Internet', 'Admin_Workstation', 'Internal_App_Server'],
              'Internal_App_Server': ['DMZ_Web_Server', 'VPN_Gateway', 'SQL_Database', 'Active_Directory'],
              'Active_Directory': ['Internal_App_Server', 'Admin_Workstation', 'SQL_Database'],
              'SQL_Database': ['Internal_App_Server', 'Active_Directory', 'Backup_Storage'],
              'Admin_Workstation': ['VPN_Gateway', 'Active_Directory', 'SQL_Database', 'Backup_Storage'],
              'Backup_Storage': ['SQL_Database', 'Admin_Workstation'],
              'Log_Collector': ['DMZ_Web_Server'],
          }

          # Movement Probabilities
          self.probs = {
              'Internet': {'DMZ_Web_Server': 0.6, 'VPN_Gateway': 0.4},
              'DMZ_Web_Server': {'Internal_App_Server': 0.7, 'Log_Collector': 0.3},
              'VPN_Gateway': {'Admin_Workstation': 0.3, 'Internal_App_Server': 0.5},
              'Internal_App_Server': {'SQL_Database': 0.6, 'Active_Directory': 0.3},
              'Active_Directory': {'SQL_Database': 0.5, 'Admin_Workstation': 0.4},
              'Admin_Workstation': {'SQL_Database': 0.4, 'Backup_Storage': 0.4},
          }

          self.attacker_pos = 'Internet'
          self.isolated_nodes = set()
          self.history = ['Internet']
          self.blocked_count = 0

      def move_attacker(self):
          current = self.attacker_pos
          if current not in self.probs:
              return {"status": "end", "message": "Attacker reached a target or dead end."}

          # Weighted choice based on probabilities
          options = list(self.probs[current].keys())
          weights = list(self.probs[current].values())
          next_node = random.choices(options, weights=weights)[0]

          if next_node in self.isolated_nodes:
              self.blocked_count += 1
              return {"status": "blocked", "target": next_node, "message": f"Attack blocked at {next_node}!"}

          self.attacker_pos = next_node
          self.history.append(next_node)
          return {"status": "moved", "target": next_node, "message": f"Attacker moved to {next_node}"}

      def isolate(self, node):
          self.isolated_nodes.add(node)
          return True

      def reset(self):
          self.attacker_pos = 'Internet'
          self.isolated_nodes = set()
          self.history = ['Internet']
          self.blocked_count = 0

  # Global engine instance
  engine = SimulationEngine()
