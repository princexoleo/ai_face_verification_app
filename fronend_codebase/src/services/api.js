import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const processImage = async (imageData) => {
    try {
        // Handle base64 image data
        if (imageData.startsWith('data:image')) {
            const base64Data = imageData.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            const blob = new Blob(byteArrays, { type: 'image/jpeg' });
            return new File([blob], 'image.jpg', { type: 'image/jpeg' });
        }
        
        // Handle File objects
        if (imageData instanceof File) {
            return imageData;
        }

        throw new Error('Unsupported image format');
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image');
    }
};

export const verifyFaces = async (idImage, liveImage) => {
    try {
        console.log('Processing images for verification...');
        
        const formData = new FormData();
        
        const idFile = await processImage(idImage);
        const liveFile = await processImage(liveImage);
        
        formData.append('id_image', idFile);
        formData.append('live_image', liveFile);

        console.log('Sending verification request...');
        
        const response = await axios.post(`${API_URL}/verify`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return {
            verified: response.data.verified,
            confidence: response.data.confidence,
            message: response.data.message,
            faces: response.data.faces
        };
    } catch (error) {
        console.error('Verification error:', error);
        throw new Error(error.response?.data?.detail || 'Verification failed');
    }
}; 