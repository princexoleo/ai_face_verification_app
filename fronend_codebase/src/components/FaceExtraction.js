import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FaceExtraction = ({ faces }) => {
  // Check if faces data exists and contains valid base64 images
  const hasValidFaces = faces && 
    faces.id_face && 
    faces.live_face && 
    faces.id_face.includes('data:image') && 
    faces.live_face.includes('data:image');

  if (!hasValidFaces) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="grid grid-cols-2 gap-8 mt-8 bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-800"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-cyber-blue">
            Extracted ID Face
          </h3>
          <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-cyber-blue/30">
            {faces.id_face.includes('data:image') ? (
              <img
                src={faces.id_face}
                alt="Extracted ID Face"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-cyber-blue">
            Extracted Live Face
          </h3>
          <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-cyber-blue/30">
            {faces.live_face.includes('data:image') ? (
              <img
                src={faces.live_face}
                alt="Extracted Live Face"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : null}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FaceExtraction; 