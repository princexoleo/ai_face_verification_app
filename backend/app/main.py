from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import verification
from app.utils.download_models import download_models
import logging
import warnings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

app = FastAPI(title="Face Verification API")

# Download models on startup
@app.on_event("startup")
async def startup_event():
    logger.info("Checking face detection models...")
    if download_models():
        logger.info("Face detection models ready")
    else:
        logger.error("Failed to download face detection models")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

warnings.filterwarnings('ignore', category=UserWarning)

app.include_router(verification.router, prefix="/api/v1")