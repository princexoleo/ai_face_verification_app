import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon, 
  IdentificationIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

const UserGuide = () => {
  const steps = [
    {
      icon: <IdentificationIcon className="w-8 h-8" />,
      title: "Upload ID Photo",
      description: "Take or upload a clear photo of your ID document"
    },
    {
      icon: <UserCircleIcon className="w-8 h-8" />,
      title: "Take Selfie",
      description: "Ensure good lighting and face the camera directly"
    },
    {
      icon: <CheckBadgeIcon className="w-8 h-8" />,
      title: "Verify Match",
      description: "Our AI will compare both photos for verification"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
    >
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800
                     hover:border-cyber-blue/50 transition-all duration-300
                     transform hover:-translate-y-1"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-cyber-blue/10 rounded-full text-cyber-blue">
              {step.icon}
            </div>
            <h3 className="text-lg font-semibold text-white">{step.title}</h3>
            <p className="text-gray-400 text-sm">{step.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default UserGuide; 