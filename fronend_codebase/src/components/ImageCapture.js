import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CameraIcon, 
  ArrowUpTrayIcon,
  UserCircleIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/solid';

const ImageCapture = ({ onCapture, label, capturedImage }) => {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      }
    }
  }, [onCapture]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="relative aspect-video rounded-xl overflow-hidden group"
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
      >
        {capturedImage ? (
          <>
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
            <AnimatePresence>
              {isHovering && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                >
                  <button
                    onClick={() => onCapture(null)}
                    className="text-white hover:text-cyber-blue transition-colors"
                  >
                    Click to retake
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="relative h-full">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "user"
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <UserCircleIcon className="w-24 h-24 text-cyber-blue/30" />
            </motion.div>
          </div>
        )}
      </motion.div>

      <div className="flex flex-col gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={capture}
          className="w-full py-3 px-4 bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20
                     border border-cyber-blue/30 rounded-lg flex items-center justify-center gap-2 
                     text-cyber-blue hover:from-cyber-blue/30 hover:to-cyber-purple/30
                     transition-all duration-300 group"
        >
          <CameraIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>{capturedImage ? `Retake ${label}` : `Capture ${label}`}</span>
        </motion.button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-cyber-dark text-gray-500">OR</span>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleFileUpload}
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 px-4 bg-gray-800/50 border border-gray-700 rounded-lg
                     flex items-center justify-center gap-2 text-gray-300 hover:bg-gray-700/50
                     transition-all duration-300 group"
        >
          <ArrowUpTrayIcon className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
          <span>Upload {label}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default ImageCapture; 