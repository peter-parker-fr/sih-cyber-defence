#!/usr/bin/env python3
"""
Installation verification script for the Cyber Defence World Model project.
Checks that all dependencies are properly installed.
"""

import sys
import subprocess
import importlib
from pathlib import Path

def check_python_version():
    """Check Python version is 3.10+"""
    if sys.version_info < (3, 10):
        print(f"❌ Python 3.10+ required (current: {sys.version})")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def check_python_package(package_name, import_name=None):
    """Check if a Python package is installed"""
    if import_name is None:
        import_name = package_name
    
    try:
        __import__(import_name)
        print(f"✅ {package_name}")
        return True
    except ImportError:
        print(f"❌ {package_name} - NOT INSTALLED")
        return False

def check_backend_dependencies():
    """Check all backend dependencies"""
    print("\n📦 Checking Backend Dependencies...")
    packages = [
        ('fastapi', 'fastapi'),
        ('uvicorn', 'uvicorn'),
        ('pandas', 'pandas'),
        ('numpy', 'numpy'),
        ('torch', 'torch'),
        ('sklearn', 'sklearn'),
        ('shap', 'shap'),
        ('pydantic', 'pydantic'),
    ]
    
    all_ok = True
    for package, import_name in packages:
        if not check_python_package(package, import_name):
            all_ok = False
    
    return all_ok

def check_node_version():
    """Check Node.js version is 16+"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        version = result.stdout.strip()
        major_version = int(version.split('.')[0].replace('v', ''))
        
        if major_version < 16:
            print(f"❌ Node.js 16+ required (current: {version})")
            return False
        print(f"✅ Node.js version: {version}")
        return True
    except FileNotFoundError:
        print("❌ Node.js - NOT FOUND")
        return False

def check_npm_packages():
    """Check npm packages in frontend"""
    print("\n📦 Checking Frontend Dependencies...")
    
    frontend_path = Path(__file__).parent / 'frontend'
    node_modules = frontend_path / 'node_modules'
    
    if not node_modules.exists():
        print("❌ node_modules not found - run 'npm install' in frontend/")
        return False
    
    packages = ['react', 'vite', 'tailwindcss', 'recharts', 'framer-motion']
    all_ok = True
    
    for package in packages:
        if (node_modules / package).exists():
            print(f"✅ {package}")
        else:
            print(f"❌ {package} - NOT INSTALLED")
            all_ok = False
    
    return all_ok

def check_directories():
    """Check required directories exist"""
    print("\n📁 Checking Project Structure...")
    
    base_path = Path(__file__).parent
    dirs = {
        'backend': base_path / 'backend',
        'frontend': base_path / 'frontend',
    }
    
    all_ok = True
    for name, path in dirs.items():
        if path.exists():
            print(f"✅ {name}/ directory")
        else:
            print(f"❌ {name}/ directory - NOT FOUND")
            all_ok = False
    
    return all_ok

def check_files():
    """Check critical files exist"""
    print("\n📄 Checking Critical Files...")
    
    base_path = Path(__file__).parent
    files = {
        'backend/main.py': base_path / 'backend' / 'main.py',
        'backend/models.py': base_path / 'backend' / 'models.py',
        'backend/requirements.txt': base_path / 'backend' / 'requirements.txt',
        'frontend/package.json': base_path / 'frontend' / 'package.json',
        'frontend/src/App.jsx': base_path / 'frontend' / 'src' / 'App.jsx',
        'README.md': base_path / 'README.md',
    }
    
    all_ok = True
    for name, path in files.items():
        if path.exists():
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - NOT FOUND")
            all_ok = False
    
    return all_ok

def check_ports():
    """Check if required ports are available"""
    print("\n🔌 Checking Ports...")
    
    import socket
    ports = {
        8000: 'Backend (FastAPI)',
        3000: 'Frontend (React)',
    }
    
    for port, service in ports.items():
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('localhost', port))
        sock.close()
        
        if result == 0:
            print(f"⚠️  Port {port} ({service}) - IN USE")
        else:
            print(f"✅ Port {port} ({service}) - Available")

def main():
    """Run all checks"""
    print("=" * 50)
    print("🔍 Cyber Defence World Model - Setup Verification")
    print("=" * 50)
    
    checks = [
        ("Python Version", check_python_version),
        ("Backend Dependencies", check_backend_dependencies),
        ("Node.js Version", check_node_version),
        ("Frontend Dependencies", check_npm_packages),
        ("Project Structure", check_directories),
        ("Critical Files", check_files),
    ]
    
    results = {}
    for name, check_func in checks:
        try:
            results[name] = check_func()
        except Exception as e:
            print(f"❌ Error checking {name}: {e}")
            results[name] = False
    
    # Check ports
    try:
        check_ports()
    except Exception as e:
        print(f"❌ Error checking ports: {e}")
    
    # Summary
    print("\n" + "=" * 50)
    print("📋 Summary")
    print("=" * 50)
    
    all_ok = all(results.values())
    
    if all_ok:
        print("✅ All checks passed! Ready to run.")
        print("\nNext steps:")
        print("1. cd backend && python -m uvicorn main:app --reload")
        print("2. In another terminal: cd frontend && npm run dev")
        print("3. Open http://localhost:3000")
    else:
        print("⚠️  Some checks failed. Please fix the issues above.")
        print("\nCommon fixes:")
        print("- Backend: pip install -r backend/requirements.txt")
        print("- Frontend: cd frontend && npm install")
    
    print("=" * 50)
    return 0 if all_ok else 1

if __name__ == '__main__':
    sys.exit(main())
