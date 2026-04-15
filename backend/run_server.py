#!/usr/bin/env python3
"""Script to start the FastAPI server with proper error handling"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("=" * 60)
print("Starting Urbanly Backend Server")
print("=" * 60)

# Check environment
print(f"Python: {sys.executable}")
print(f"Working directory: {os.getcwd()}")

# Check .env file
env_path = os.path.join(os.path.dirname(__file__), '.env')
print(f".env file exists: {os.path.exists(env_path)}")
if os.path.exists(env_path):
    with open(env_path) as f:
        content = f.read()
        has_key = 'GEMINI_API_KEY' in content
        print(f"Contains GEMINI_API_KEY: {has_key}")

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')
if api_key:
    print(f"API Key loaded: {api_key[:15]}...")
else:
    print("WARNING: No API key found!")

# Try importing the app
try:
    print("\nImporting FastAPI app...")
    from main import app
    print("✓ App imported successfully")
except Exception as e:
    print(f"✗ Failed to import app: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Start the server
print("\nStarting Uvicorn server on port 8000...")
print("Press Ctrl+C to stop")
print("=" * 60)

import uvicorn
uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
