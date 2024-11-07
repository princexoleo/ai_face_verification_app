import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCapture from './components/ImageCapture';
import VerificationStatus from './components/VerificationStatus';
import FaceExtraction from './components/FaceExtraction';
import UserGuide from './components/UserGuide';
import { verifyFaces } from './services/api';
import { ArrowPathIcon, ShieldCheckIcon, IdentificationIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import VerificationTimer from './components/VerificationTimer';

function App() {
    const [idImage, setIdImage] = useState(null);
    const [liveImage, setLiveImage] = useState(null);
    const [status, setStatus] = useState(null);
    const [faces, setFaces] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showFaces, setShowFaces] = useState(false);
    const [verificationTime, setVerificationTime] = useState(null);

    const handleVerification = async () => {
        if (!idImage || !liveImage) {
            setError('Please provide both ID and person photos');
            return;
        }

        setIsLoading(true);
        setError(null);
        setShowFaces(false);
        setFaces(null);
        setVerificationTime(null);

        const startTime = performance.now();

        try {
            const result = await verifyFaces(idImage, liveImage);
            const endTime = performance.now();
            const timeInSeconds = ((endTime - startTime) / 1000).toFixed(2);
            setVerificationTime(timeInSeconds);
            
            setStatus(result);
            
            if (result.faces && 
                result.faces.id_face && 
                result.faces.live_face && 
                result.faces.id_face.includes('data:image') && 
                result.faces.live_face.includes('data:image')) {
                setFaces(result.faces);
                setShowFaces(true);
            } else {
                setFaces(null);
                setShowFaces(false);
            }
        } catch (err) {
            setError(err.message);
            setFaces(null);
            setShowFaces(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cyber-dark text-white">
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyber-dark via-cyber-dark to-black -z-10" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center mb-4">
                        <ShieldCheckIcon className="w-12 h-12 text-cyber-blue mr-4" />
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent animate-gradient">
                            AI Face Verification
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Secure identity verification powered by advanced artificial intelligence
                    </p>
                </motion.div>

                {/* User Guide */}
                <UserGuide />

                {/* Main Content */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-800
                                       hover:border-cyber-blue/30 transition-all duration-500">
                            <h2 className="text-xl font-semibold mb-6 text-cyber-blue flex items-center">
                                <IdentificationIcon className="w-6 h-6 mr-2" />
                                ID Document Photo
                            </h2>
                            <ImageCapture
                                onCapture={setIdImage}
                                label="ID Document"
                                capturedImage={idImage}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-800
                                       hover:border-cyber-blue/30 transition-all duration-500">
                            <h2 className="text-xl font-semibold mb-6 text-cyber-blue flex items-center">
                                <UserCircleIcon className="w-6 h-6 mr-2" />
                                Person Photo
                            </h2>
                            <ImageCapture
                                onCapture={setLiveImage}
                                label="Person Photo"
                                capturedImage={liveImage}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Verification Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center gap-8"
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleVerification}
                        disabled={!idImage || !liveImage || isLoading}
                        className={`
                            px-8 py-4 rounded-xl text-lg font-semibold
                            flex items-center gap-3
                            transition-all duration-300
                            ${
                                !idImage || !liveImage || isLoading
                                    ? 'bg-gray-700/50 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-cyber-blue to-cyber-purple hover:shadow-lg hover:shadow-cyber-blue/20'
                            }
                        `}
                    >
                        {isLoading ? (
                            <>
                                <ArrowPathIcon className="w-6 h-6 animate-spin" />
                                <span>Verifying...</span>
                            </>
                        ) : (
                            <>
                                <ShieldCheckIcon className="w-6 h-6" />
                                <span>Verify Face Match</span>
                            </>
                        )}
                    </motion.button>

                    {/* Add FaceExtraction component before VerificationStatus */}
                    <AnimatePresence mode="wait">
                        {showFaces && faces && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full max-w-4xl mx-auto mb-8"
                            >
                                <FaceExtraction faces={faces} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* VerificationStatus */}
                    <AnimatePresence mode="wait">
                        {(status || error || isLoading) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full max-w-2xl mx-auto"
                            >
                                <VerificationStatus
                                    status={status}
                                    isLoading={isLoading}
                                    error={error}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Add verification time display */}
                    <AnimatePresence mode="wait">
                        <motion.div className="w-full max-w-4xl mx-auto mb-4 text-center">
                            <VerificationTimer time={verificationTime} isLoading={isLoading} />
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}

export default App;
