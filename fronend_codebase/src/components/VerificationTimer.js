import React from 'react';
import { motion } from 'framer-motion';

const VerificationTimer = ({ time, isLoading }) => {
  if (!time && !isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="inline-block px-4 py-2 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30"
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-cyber-blue border-t-transparent rounded-full" />
          <span className="text-cyber-blue">Processing...</span>
        </div>
      ) : (
        <span className="text-cyber-blue">
          Verification completed in: {time} seconds
        </span>
      )}
    </motion.div>
  );
};

export default VerificationTimer; 