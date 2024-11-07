import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const VerificationStatus = ({ status, isLoading, error }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-900/50 backdrop-blur-lg rounded-lg p-6 border border-gray-800"
      >
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-blue"></div>
          <span className="ml-3 text-gray-400">Verifying faces...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-900/20 backdrop-blur-lg rounded-lg p-6 border border-red-800"
      >
        <div className="flex items-center text-red-400">
          <XCircleIcon className="w-6 h-6 mr-2" />
          <span>{error}</span>
        </div>
      </motion.div>
    );
  }

  if (!status) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`backdrop-blur-lg rounded-lg p-6 border
        ${status.verified 
          ? 'bg-green-900/20 border-green-800' 
          : 'bg-red-900/20 border-red-800'
        }`}
    >
      <div className="flex flex-col items-center gap-4">
        {status.verified ? (
          <CheckCircleIcon className="w-12 h-12 text-green-400" />
        ) : (
          <XCircleIcon className="w-12 h-12 text-red-400" />
        )}
        
        <div className="text-center">
          <h3 className={`text-xl font-semibold mb-2 
            ${status.verified ? 'text-green-400' : 'text-red-400'}`}>
            {status.verified ? 'Face Match Verified' : 'No Face Match'}
          </h3>
          <p className="text-gray-400">
            Confidence Score: {(status.confidence * 100).toFixed(2)}%
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default VerificationStatus; 