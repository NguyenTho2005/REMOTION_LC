import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.routes import router as tts_router
from app.services.zerotts_engine import engine

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("tts_main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Warm up model in background/thread
    logger.info("Starting ZeroTTS Studio backend...")
    try:
        engine.initialize_model()
        logger.info("ZeroTTS model initialized successfully.")
    except Exception as e:
        logger.error(f"Background model initialization failed: {e}")
    yield
    # Shutdown
    logger.info("Shutting down ZeroTTS Studio backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ZeroTTS backend service for REMOTION-LC Voice Studio",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for Remotion Studio and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handler for unhandled exceptions (never expose stack trace to UI)
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Lỗi hệ thống nội bộ từ ZeroTTS Service. Vui lòng thử lại sau."},
    )

# Mount generated audio files
if settings.AUDIO_GENERATED_DIR.exists():
    app.mount(
        "/audio/generated",
        StaticFiles(directory=str(settings.AUDIO_GENERATED_DIR)),
        name="generated_audio",
    )

# Include TTS routes
app.include_router(tts_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
