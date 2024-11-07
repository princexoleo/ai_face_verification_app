from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any
import logging
import numpy as np
from app.services.face_service import FaceService

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/verify")
async def verify_faces(
    id_image: UploadFile = File(...),
    live_image: UploadFile = File(...)
) -> Dict[str, Any]:
    try:
        # Validate file sizes
        max_size = 10 * 1024 * 1024  # 10MB
        for image in [id_image, live_image]:
            contents = await image.read()
            if len(contents) > max_size:
                raise HTTPException(
                    status_code=400,
                    detail=f"File {image.filename} is too large. Maximum size is 10MB"
                )
            await image.seek(0)

        # Read files
        id_contents = await id_image.read()
        live_contents = await live_image.read()

        # Verify faces
        verified, confidence, face_data = await FaceService.verify_faces(
            id_contents, 
            live_contents
        )

        # Ensure all numpy types are converted to Python types
        response = {
            "verified": bool(verified),
            "confidence": float(confidence),
            "message": "Face verification completed successfully",
            "faces": {
                "id_face": face_data['id_face'],
                "live_face": face_data['live_face'],
                "id_box": face_data['id_box'],
                "live_box": face_data['live_box']
            },
            "quality_scores": face_data['quality_scores']
        }

        return response

    except Exception as e:
        logger.error(f"Verification error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e)) 