# Quick Start Guide

## 🚀 Fastest Way to Run the Application

### **5-Minute Setup**

**Terminal 1 - Backend:**
```bash
cd d:\SIH\backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Wait for message: "Application startup complete"

**Terminal 2 - Frontend:**
```bash
cd d:\SIH\frontend
npm install
npm run dev
```

Wait for message: "VITE v... ready in XXX ms"

**Open Browser:**
Navigate to `http://localhost:3000`

---

## 📊 First Steps

1. **Landing Page** - Loads automatically, shows project overview
2. **Click "Live Demo"** - Goes to Dashboard
3. **Click "Load Sample Data"** - Loads pre-computed predictions instantly
4. **View Results:**
   - Infiltration probability timeline (top left)
   - MITRE ATT&CK stages (top right)
   - Risk metrics cards
   - Explainability panel
   - Suspicious flows table

---

## 🗂️ File Structure Quick Reference

```
d:\SIH\
├── backend/
│   ├── main.py              ← FastAPI app entry point
│   ├── models.py            ← LSTM implementation
│   ├── data_generator.py    ← Synthetic data
│   ├── requirements.txt     ← Install with: pip install -r requirements.txt
│   └── models/              ← Auto-created, stores trained models
│
├── frontend/
│   ├── src/main.jsx         ← React entry point
│   ├── src/App.jsx          ← Main app routing
│   ├── src/pages/           ← Page components
│   ├── src/components/      ← Reusable components
│   ├── package.json         ← Install with: npm install
│   └── vite.config.js       ← Vite configuration
│
└── README.md                ← Full documentation
```

---

## 🎯 Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Landing | localhost:3000 | Overview & introduction |
| Dashboard | localhost:3000 | Live threat predictions |
| Architecture | localhost:3000/architecture | System design |
| Benchmarks | localhost:3000/benchmarks | Model comparison |
| About | localhost:3000/about | Project details |

---

## 🔧 Troubleshooting

**Port Already in Use?**
```bash
# Use different port
python -m uvicorn main:app --port 8001
# Update vite.config.js proxy target accordingly
```

**Module Not Found (Python)?**
```bash
# Reinstall dependencies
pip install -r backend/requirements.txt --force-reinstall
```

**Module Not Found (Node)?**
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Model Takes Too Long to Train?**
- First run trains the model (~30-60 seconds)
- Subsequent runs load the cached model instantly
- If slow, check CPU/RAM availability

---

## 📥 Using Your Own Data

1. Prepare CSV with columns:
   ```
   src_ip, dst_ip, src_port, dst_port, protocol, bytes, packets, duration, tcp_flags, iat_mean, iat_var, iat_max
   ```

2. On Dashboard, click "Download Template" to get the format

3. Fill in your network flow data

4. Upload CSV file

5. View predictions and analysis

---

## 🧠 Model Pipeline (What Happens When You Upload)

1. **CSV Loaded** - 85 network flows
2. **Features Extracted** - 16 features per flow
3. **Normalization** - Standardization with learned scaler
4. **LSTM Inference** - ~234ms for 85 flows
5. **MITRE Mapping** - Probability → Stage classification
6. **Explainability** - Top-5 features computed
7. **Results Returned** - Charts updated instantly

---

## 📊 Sample Predictions

When you click "Load Sample Data", it shows:
- **85 flows** analyzed from sample dataset
- **Average infiltration:** ~35-40%
- **Stage distribution:** Mix of all 5 MITRE stages
- **Top features:** SYN ratio, suspicious ports, IAT metrics

---

## 🎨 UI Features Explained

- **Blue glow effects** = Interactive elements, hover for highlights
- **Animated lines** = Real-time data flow
- **Pulsing badges** = Model status indicator
- **Glassmorphic cards** = Modern design aesthetic
- **Color coding:**
  - 🔵 Blue = Normal/Information
  - 🟡 Amber = Warning
  - 🔴 Red = Critical/High risk
  - 🟢 Green = Success/Low risk

---

## 📞 API Endpoints (Advanced)

Use Postman or curl to test:

```bash
# Health check
curl http://localhost:8000/health

# Get model info
curl http://localhost:8000/model-info

# Get benchmarks
curl http://localhost:8000/benchmark

# Predict (upload CSV)
curl -X POST -F "file=@flows.csv" http://localhost:8000/predict
```

---

## ✅ Checklist Before Demo

- [ ] Backend running (shows "Application startup complete")
- [ ] Frontend running (shows "VITE ready")
- [ ] Browser opens to localhost:3000
- [ ] Landing page loads
- [ ] Click "Live Demo" → Dashboard loads
- [ ] Click "Load Sample Data" → Predictions appear
- [ ] Charts and tables render correctly
- [ ] Model status badge shows "Ready"

---

**Ready to go! 🚀**

If any issues, check the full README.md for detailed troubleshooting.
