import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Try both import styles
try:
    from backend.routes.location import router as location_router
    from backend.routes.product import router as product_router
except ImportError:
    from routes.location import router as location_router
    from routes.product import router as product_router

app = FastAPI(title="Urbanly API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(location_router, prefix="/api")
app.include_router(product_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Urbanly API is running"}
