#!/usr/bin/env python3
import sys
print(f"Python: {sys.executable}")
print(f"Version: {sys.version}")

try:
    import fastapi
    print(f"FastAPI: {fastapi.__version__}")
except Exception as e:
    print(f"ERROR loading FastAPI: {e}")

try:
    import google.generativeai as genai
    print(f"Google Generative AI: loaded")
except Exception as e:
    print(f"ERROR loading google.generativeai: {e}")

try:
    from dotenv import load_dotenv
    print(f"python-dotenv: loaded")
except Exception as e:
    print(f"ERROR loading dotenv: {e}")

# Try importing the app
try:
    sys.path.insert(0, 'd:/URBANLY/backend')
    from main import app
    print("SUCCESS: FastAPI app imported!")
except Exception as e:
    print(f"ERROR importing app: {e}")
    import traceback
    traceback.print_exc()
