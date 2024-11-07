# Robi Biometric Face Verification - Backend

A FastAPI-based backend service for face verification and biometric matching.

## Features

- Face detection and verification
- Image quality assessment
- Performance metrics tracking
- Secure API endpoints
- Cross-origin resource sharing (CORS) support

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Virtual environment (recommended)

## Installation

1. Clone the repository:

git clone https://github.com/princexoleo/ai_face_verification_app.git

2. Create and activate virtual environment:

# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Download required models:
```bash
python app/utils/download_models.py
```

## Configuration

Create a `.env` file in the backend directory:
```env
SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000
```

## Running the Server

```bash
# Development
uvicorn app.main:app --reload --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Face Verification
- POST `/api/v1/verify`
  - Accepts two images (ID and live photo)
  - Returns verification result and confidence score

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   ├── routers/
│   ├── services/
│   └── utils/
├── tests/
├── .env
├── .gitignore
└── requirements.txt
```

## Testing

```bash
pytest
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[MIT License](LICENSE)
```
