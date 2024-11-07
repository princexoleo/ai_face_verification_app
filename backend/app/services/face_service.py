import cv2
import numpy as np
import face_recognition
from typing import Tuple, Optional, Dict
import logging
from concurrent.futures import ThreadPoolExecutor
from .image_quality import ImageQualityChecker
import torch
import base64
from pathlib import Path

logger = logging.getLogger(__name__)

class FaceService:
    # Get the base directory
    BASE_DIR = Path(__file__).resolve().parent.parent
    MODELS_DIR = BASE_DIR / 'models'

    # Model paths
    PROTOTXT_PATH = str(MODELS_DIR / 'deploy.prototxt')
    MODEL_PATH = str(MODELS_DIR / 'res10_300x300_ssd_iter_140000.caffemodel')

    # Check CUDA availability
    CUDA_AVAILABLE = torch.cuda.is_available() and cv2.cuda.getCudaEnabledDeviceCount() > 0
    
    if CUDA_AVAILABLE:
        logger.info("CUDA is available and will be used for processing")
    else:
        logger.info("CUDA is not available, using CPU for processing")

    # Initialize face detection model
    try:
        face_detector = cv2.dnn.readNetFromCaffe(
            PROTOTXT_PATH,
            MODEL_PATH
        )
        
        if CUDA_AVAILABLE:
            try:
                face_detector.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
                face_detector.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA)
                logger.info("Successfully enabled CUDA for face detection")
            except Exception as e:
                logger.warning(f"Failed to enable CUDA backend: {str(e)}")
                logger.info("Falling back to CPU processing")
    except Exception as e:
        logger.error(f"Error loading face detection model: {str(e)}")
        raise Exception("Failed to load face detection model. Please ensure model files are downloaded.")

    @staticmethod
    def preprocess_for_gpu(image: np.ndarray) -> np.ndarray:
        """Preprocess image for GPU acceleration if available."""
        if FaceService.CUDA_AVAILABLE:
            try:
                # Convert to CUDA GPU mat
                gpu_mat = cv2.cuda_GpuMat()
                gpu_mat.upload(image)
                
                # Apply GPU-accelerated operations
                gpu_mat = cv2.cuda.resize(gpu_mat, (300, 300))
                gpu_mat = cv2.cuda.cvtColor(gpu_mat, cv2.COLOR_BGR2RGB)
                
                # Download back to CPU
                return gpu_mat.download()
            except Exception as e:
                logger.warning(f"GPU processing failed, falling back to CPU: {str(e)}")
                return image
        return image

    @staticmethod
    def detect_face_dnn(image: np.ndarray, min_confidence: float = 0.5) -> list:
        """Faster face detection using DNN."""
        try:
            # Preprocess image
            processed_image = FaceService.preprocess_for_gpu(image)
            (h, w) = processed_image.shape[:2]
            
            # Create blob
            blob = cv2.dnn.blobFromImage(
                cv2.resize(processed_image, (300, 300)), 1.0,
                (300, 300), (104.0, 177.0, 123.0)
            )
            
            FaceService.face_detector.setInput(blob)
            detections = FaceService.face_detector.forward()
            
            faces = []
            for i in range(0, detections.shape[2]):
                confidence = detections[0, 0, i, 2]
                if confidence > min_confidence:
                    box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                    (startX, startY, endX, endY) = box.astype("int")
                    faces.append((startY, endX, endY, startX))
            
            return faces
        except Exception as e:
            logger.error(f"Face detection failed: {str(e)}")
            # Fallback to CPU-based detection
            return face_recognition.face_locations(image, model="hog")

    @staticmethod
    def extract_face(image: np.ndarray, face_location: tuple, padding: int = 30) -> Tuple[np.ndarray, tuple]:
        """
        Extract face from image using location with padding.
        Args:
            image: Input image
            face_location: Tuple of (top, right, bottom, left)
            padding: Padding around the face in pixels
        Returns:
            Tuple of (face_image, face_location)
        """
        top, right, bottom, left = face_location
        height, width = image.shape[:2]

        # Add padding but ensure we don't go outside image bounds
        top = max(top - padding, 0)
        left = max(left - padding, 0)
        bottom = min(bottom + padding, height)
        right = min(right + padding, width)

        face_image = image[top:bottom, left:right]
        return face_image, (top, right, bottom, left)

    @staticmethod
    def process_image(image_data: bytes) -> Tuple[np.ndarray, Dict]:
        """Process and validate image quality."""
        # Decode image
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise ValueError("Failed to decode image")
            
        # Check initial quality
        quality_check = ImageQualityChecker.check_image_quality(image)
        
        # If quality is poor, try to enhance
        if not quality_check['is_usable']:
            image = ImageQualityChecker.enhance_image(image)
            quality_check = ImageQualityChecker.check_image_quality(image)
            
        return image, quality_check

    @staticmethod
    async def verify_faces(id_image: bytes, live_image: bytes) -> Tuple[bool, float, Dict]:
        try:
            # Process images in parallel
            with ThreadPoolExecutor() as executor:
                id_future = executor.submit(FaceService.process_image, id_image)
                live_future = executor.submit(FaceService.process_image, live_image)
                
                id_img, id_quality = id_future.result()
                live_img, live_quality = live_future.result()

            # Check quality scores
            if not id_quality['is_usable']:
                raise ValueError("ID image quality too low for accurate verification")
            if not live_quality['is_usable']:
                raise ValueError("Live image quality too low for accurate verification")

            # Convert to RGB for face_recognition library
            id_rgb = cv2.cvtColor(id_img, cv2.COLOR_BGR2RGB)
            live_rgb = cv2.cvtColor(live_img, cv2.COLOR_BGR2RGB)

            # Detect faces using faster DNN method
            id_face_locations = FaceService.detect_face_dnn(id_rgb)
            live_face_locations = FaceService.detect_face_dnn(live_rgb)

            if not id_face_locations:
                raise ValueError("No face detected in ID photo")
            if not live_face_locations:
                raise ValueError("No face detected in live photo")

            # Get face encodings
            id_encoding = face_recognition.face_encodings(
                id_rgb, 
                [id_face_locations[0]],
                num_jitters=2,
                model="large"
            )[0]
            
            live_encoding = face_recognition.face_encodings(
                live_rgb, 
                [live_face_locations[0]],
                num_jitters=2,
                model="large"
            )[0]

            # Calculate similarity
            distance = face_recognition.face_distance([id_encoding], live_encoding)[0]
            similarity = float(1 - distance)  # Convert numpy.float to Python float

            # Extract faces for display
            id_face, id_box = FaceService.extract_face(id_rgb, id_face_locations[0])
            live_face, live_box = FaceService.extract_face(live_rgb, live_face_locations[0])

            # Convert face images to base64
            _, id_buffer = cv2.imencode('.jpg', cv2.cvtColor(id_face, cv2.COLOR_RGB2BGR))
            _, live_buffer = cv2.imencode('.jpg', cv2.cvtColor(live_face, cv2.COLOR_RGB2BGR))
            
            id_face_base64 = base64.b64encode(id_buffer).decode('utf-8')
            live_face_base64 = base64.b64encode(live_buffer).decode('utf-8')

            # Adjust threshold based on quality scores
            base_threshold = 0.5
            quality_factor = min(id_quality['quality_score'], live_quality['quality_score']) / 100
            adjusted_threshold = base_threshold * (0.8 + 0.2 * quality_factor)

            verified = bool(similarity >= adjusted_threshold)  # Convert numpy.bool to Python bool

            return verified, similarity, {
                'id_face': id_face_base64,
                'live_face': live_face_base64,
                'id_box': tuple(map(int, id_box)),  # Convert numpy.int to Python int
                'live_box': tuple(map(int, live_box)),
                'quality_scores': {
                    'id': {k: float(v) if isinstance(v, np.number) else v 
                          for k, v in id_quality.items()},
                    'live': {k: float(v) if isinstance(v, np.number) else v 
                            for k, v in live_quality.items()}
                }
            }

        except Exception as e:
            logger.error(f"Face verification failed: {str(e)}")
            raise Exception(f"Face verification failed: {str(e)}")