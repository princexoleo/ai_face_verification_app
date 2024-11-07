# Robi Biometric Face Verification - Frontend

A modern React-based web application for biometric face verification, featuring real-time face matching and quality assessment.

## 🚀 Features

- **Face Verification**
  - Real-time face matching
  - Quality assessment
  - Performance metrics
  - Verification status display

- **Image Handling**
  - Drag & drop support
  - Image preview
  - Format validation
  - Size validation

- **User Interface**
  - Modern dark theme
  - Responsive design
  - Loading animations
  - Error handling
  - Success feedback

## 🛠️ Tech Stack

- **React 18**
- **Tailwind CSS** - For styling
- **Framer Motion** - For animations
- **Axios** - For API requests
- **Hero Icons** - For UI icons

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/princexoleo/ai_face_verification_frontend.git
```
2. Install dependencies:

```bash
npm install
```
3. Start the development server:

```bash
npm run dev
```
cp .env.example .env

4. Run the backend server:

```bash
cd ../backend
python app/main.py
```

## 🔧 Configuration

Create a `.env` file with the following variables:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## 📁 Project Structure

frontend/
├── public/
│ ├── index.html
│ └── manifest.json
├── src/
│ ├── components/
│ │ ├── ImageUpload/
│ │ ├── FaceVerification/
│ │ ├── ResultDisplay/
│ │ └── PerformanceMetrics/
│ ├── services/
│ │ └── api.js
│ ├── styles/
│ │ └── index.css
│ ├── utils/
│ │ └── helpers.js
│ ├── App.js
│ └── index.js
├── .env
├── .gitignore
└── package.json


## 🎯 Key Components

### ImageUpload
- Handles image upload functionality
- Supports drag & drop
- Provides image preview
- Validates file types and sizes

### FaceVerification
- Manages verification process
- Displays verification status
- Shows loading states
- Handles errors

### ResultDisplay
- Shows verification results
- Displays confidence scores
- Presents extracted faces
- Indicates match status

### PerformanceMetrics
- Shows processing time
- Displays quality scores
- Indicates system performance

## 🚀 Available Scripts



## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔒 Security Features

- Input validation
- File type checking
- Size limitations
- Error boundaries
- Secure API calls

## 🌐 API Integration

The frontend communicates with the backend API at `http://localhost:8000` with the following endpoints:

- `POST /api/v1/verify` - Face verification endpoint
  - Accepts: Two images (ID and live photo)
  - Returns: Verification result and confidence score

## ⚡ Performance Optimizations

- Lazy loading of components
- Image compression
- Caching strategies
- Optimized re-renders
- Code splitting

## 🎨 Styling

Using Tailwind CSS with custom configuration:



## 🔧 Development

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details

## 👥 Contributors

- Prince Raj (princexoleo)

## 📞 Support

For support, email prince.raj@robi.com.bd

---

Made with ❤️ by Prince Raj

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
