# 🎯 Installation & First Run Guide

## Step-by-Step Setup Instructions

This guide will get you from zero to running in **10 minutes**.

---

## Prerequisites Check

Before you start, verify you have:

- [ ] **Python 3.10+** installed
  ```bash
  python --version
  ```
  
- [ ] **Node.js 16+** installed
  ```bash
  node --version
  npm --version
  ```

If not installed, download from:
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/

---

## Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd d:\SIH
```

Verify you see these files:
- `README.md`
- `BUILD_SUMMARY.md`
- `QUICK_START.md`
- `backend/` folder
- `frontend/` folder

### Step 2: Verify Project Structure

```bash
# Optional: Run verification
python verify_setup.py
```

You should see mostly ✅ marks (some ❌ OK initially)

### Step 3: Install Backend Dependencies

```bash
cd backend

# Install Python packages
pip install -r requirements.txt
```

⏱️ **Time:** ~3-5 minutes (depends on internet speed)

✅ **Success looks like:**
```
Successfully installed fastapi-0.104.1 uvicorn-0.24.0 ...
```

### Step 4: Install Frontend Dependencies

```bash
cd ../frontend

# Install NPM packages
npm install
```

⏱️ **Time:** ~5-10 minutes (depends on internet speed)

✅ **Success looks like:**
```
added 200+ packages, and audited 210 packages in 3m
```

### Step 5: Verify Installation

Return to root and run verification:

```bash
cd ..
python verify_setup.py
```

You should now see mostly ✅ marks on everything.

---

## Running the Application

### Option A: Two Terminal Windows (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd d:\SIH\backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ **Success looks like:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**Terminal 2 - Frontend:**
```bash
cd d:\SIH\frontend
npm run dev
```

✅ **Success looks like:**
```
VITE v4.4.0  ready in 542 ms
Local:  http://localhost:3000/
```

### Option B: Docker (Recommended for Demo)

Requires Docker Desktop installed.

```bash
cd d:\SIH

# Start both services
docker-compose up

# Wait for output:
# backend  | Application startup complete
# frontend | ready in XXX ms
```

✅ **Access:** http://localhost:3000

---

## First Use

### 1. **Open Browser**
```
http://localhost:3000
```

You should see the landing page with:
- CyberDefence WM logo (top left)
- Hero section with "Live Demo" button
- Features section

### 2. **Navigate to Dashboard**
Click "Live Demo" button or "Dashboard" in menu

You should see:
- "Upload Network Traffic Data" section
- "Quick Actions" panel
- "Load Sample Data" button

### 3. **Load Sample Data**
Click "Load Sample Data" button

⏱️ **Wait:** 5-30 seconds for first prediction (model trains on first run)

✅ **Success:** Charts appear showing:
- Infiltration probability timeline
- MITRE ATT&CK stage timeline
- Risk metrics cards

### 4. **Explore Features**
- Click on timeline points to update explainability
- Scroll down to see suspicious flows table
- View feature importance chart
- Read natural language summary

### 5. **Check Other Pages**
- **Architecture:** System design diagram
- **Benchmarks:** LSTM vs Baseline comparison
- **About:** Project information

---

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Use different port
python -m uvicorn main:app --port 8001

# Update frontend proxy in vite.config.js
```

**Module not found errors:**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Model training takes too long:**
- Normal: First run takes 30-60 seconds
- Try: Close other applications for faster training

### Frontend Issues

**npm install fails:**
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

**Port 3000 already in use:**
```bash
# Use different port
npm run dev -- --port 3001
```

**Vite dev server not showing changes:**
```bash
# Restart dev server
Ctrl+C
npm run dev
```

### API Connection Issues

**"Cannot connect to backend" error:**
1. Verify backend is running (check terminal 1)
2. Check URL in browser console (F12)
3. Verify port 8000 is accessible
4. Try: `http://localhost:8000/health` in browser

**Sample data not loading:**
1. Check backend terminal for errors
2. Verify backend is online (green status badge)
3. Try browser refresh (Ctrl+R)

---

## Normal First Run Experience

### Backend Terminal Output
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
No trained model found. Training on sample data...
Epoch 1/15, Loss: 0.6234
Epoch 5/15, Loss: 0.4521
Epoch 10/15, Loss: 0.3421
Epoch 15/15, Loss: 0.2834
Training complete!
Benchmark Metrics: {'lstm': {...}, 'baseline': {...}}
```

### Frontend Terminal Output
```
VITE v4.4.0  ready in 542 ms
Local:   http://localhost:3000/
```

### Browser Flow
1. Landing page loads
2. Click "Live Demo" → Dashboard
3. Click "Load Sample Data"
4. Model initializes on backend (backend terminal shows training)
5. Frontend waits for response
6. Charts appear ~30 seconds later

---

## Testing Your Installation

### Quick Test
1. Open http://localhost:3000
2. Go to Dashboard
3. Click "Load Sample Data"
4. Should show charts within 30 seconds

### API Test
```bash
# In another terminal/PowerShell:

# Test health
curl http://localhost:8000/health

# Test model info
curl http://localhost:8000/model-info

# Should return JSON responses
```

### File Upload Test
1. Click "Download Template" on Dashboard
2. Opens sample CSV file
3. Modify if desired (or use as-is)
4. Upload the file
5. Should show results

---

## File Locations to Know

| Item | Location |
|------|----------|
| Backend code | `d:\SIH\backend\main.py` |
| ML models | `d:\SIH\backend\models.py` |
| Frontend code | `d:\SIH\frontend\src\App.jsx` |
| Configuration | `d:\SIH\frontend\vite.config.js` |
| Documentation | `d:\SIH\README.md` |

---

## Environment Variables (Optional)

If you want to customize, create `.env` in backend/:

```env
# .env file
MODEL_PATH=models
API_PORT=8000
DEBUG=True
```

Then in `main.py`, load with:
```python
import os
model_path = os.getenv('MODEL_PATH', 'models')
```

---

## Production Deployment

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
# Creates dist/ folder
```

**Backend:**
```bash
cd backend
# No build needed, Python files are ready
```

### Deploy with Docker

```bash
cd d:\SIH
docker-compose up --build
# Access: http://localhost:3000
```

### Deploy to Cloud

All files are production-ready for:
- AWS (Lambda, ECS, AppRunner)
- Google Cloud (Cloud Run, App Engine)
- Azure (Container Instances, App Service)
- Any Docker-compatible platform

---

## Common Commands Reference

| Task | Command |
|------|---------|
| Install backend deps | `pip install -r backend/requirements.txt` |
| Install frontend deps | `cd frontend && npm install` |
| Run backend | `cd backend && python -m uvicorn main:app --reload` |
| Run frontend dev | `cd frontend && npm run dev` |
| Build frontend | `cd frontend && npm run build` |
| Docker start | `docker-compose up` |
| Verify setup | `python verify_setup.py` |
| API documentation | Visit `http://localhost:8000/docs` |

---

## Next Steps After Installation

1. ✅ Verify everything is running
2. ✅ Load sample data for demo
3. ✅ Explore all dashboard features
4. ✅ Test with your own CSV data
5. ✅ Review documentation
6. ✅ Prepare presentation

---

## Getting Help

### Check Logs
- **Backend errors:** Look at backend terminal
- **Frontend errors:** Open browser DevTools (F12)
- **Network errors:** Check Network tab in DevTools

### Read Documentation
- **Setup:** `README.md`
- **Quick start:** `QUICK_START.md`
- **Summary:** `BUILD_SUMMARY.md`

### Common Issues
- See `README.md` Troubleshooting section
- Run `verify_setup.py` to diagnose
- Check QUICK_START.md for common fixes

---

## You're Ready! 🚀

Once everything is running:
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs
- API Health: http://localhost:8000/health

**Time to presentation! 🎉**

---

*Last Updated: 2026-09-10*
