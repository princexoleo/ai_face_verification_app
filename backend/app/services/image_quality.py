import cv2
import numpy as np
from typing import Tuple, Dict
import logging

logger = logging.getLogger(__name__)

class ImageQualityChecker:
    # Minimum acceptable values
    MIN_BRIGHTNESS = 0.15
    MIN_CONTRAST = 30.0
    MIN_SHARPNESS = 50.0
    MIN_FACE_SIZE = 100  # minimum face width/height in pixels

    @staticmethod
    def check_brightness(image: np.ndarray) -> Tuple[float, bool]:
        """Check image brightness."""
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        _, _, v = cv2.split(hsv)
        brightness = v.mean() / 255.0
        return brightness, brightness > ImageQualityChecker.MIN_BRIGHTNESS

    @staticmethod
    def check_contrast(image: np.ndarray) -> Tuple[float, bool]:
        """Check image contrast."""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        contrast = gray.std()
        return contrast, contrast > ImageQualityChecker.MIN_CONTRAST

    @staticmethod
    def check_sharpness(image: np.ndarray) -> Tuple[float, bool]:
        """Check image sharpness using Laplacian variance."""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        return laplacian_var, laplacian_var > ImageQualityChecker.MIN_SHARPNESS

    @staticmethod
    def check_face_size(face_location: tuple) -> Tuple[float, bool]:
        """Check if detected face is large enough."""
        if not face_location:
            return 0, False
        top, right, bottom, left = face_location
        face_width = right - left
        face_height = bottom - top
        min_dimension = min(face_width, face_height)
        return min_dimension, min_dimension > ImageQualityChecker.MIN_FACE_SIZE

    @staticmethod
    def enhance_image(image: np.ndarray) -> np.ndarray:
        """Enhance image quality."""
        # Convert to LAB color space
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)

        # Apply CLAHE to L channel
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
        cl = clahe.apply(l)

        # Merge channels
        enhanced_lab = cv2.merge((cl,a,b))
        enhanced_bgr = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)

        # Denoise
        enhanced_bgr = cv2.fastNlMeansDenoisingColored(enhanced_bgr)

        return enhanced_bgr

    @staticmethod
    def check_image_quality(image: np.ndarray, face_location: tuple = None) -> Dict[str, any]:
        """Check overall image quality."""
        brightness, is_bright_enough = ImageQualityChecker.check_brightness(image)
        contrast, has_good_contrast = ImageQualityChecker.check_contrast(image)
        sharpness, is_sharp_enough = ImageQualityChecker.check_sharpness(image)
        
        face_size = 0
        has_good_face_size = False
        if face_location:
            face_size, has_good_face_size = ImageQualityChecker.check_face_size(face_location)

        quality_score = (
            (brightness / ImageQualityChecker.MIN_BRIGHTNESS) * 0.3 +
            (contrast / ImageQualityChecker.MIN_CONTRAST) * 0.3 +
            (sharpness / ImageQualityChecker.MIN_SHARPNESS) * 0.4
        ) * 100

        return {
            'quality_score': min(100, quality_score),
            'is_usable': all([is_bright_enough, has_good_contrast, is_sharp_enough]),
            'details': {
                'brightness': brightness,
                'contrast': contrast,
                'sharpness': sharpness,
                'face_size': face_size
            }
        } 