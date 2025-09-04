import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, Trophy, Coins } from 'lucide-react';
import type { VideoLesson } from '../../types/game';
import { VideoPlayer } from './VideoPlayer';
import { InteractiveSection } from './InteractiveSection';
import { MiniGame } from './MiniGame';
import { UpsellModal } from './UpsellModal';

interface VideoLessonViewerProps {
  lesson: VideoLesson;
  onComplete: (success: boolean) => void;
}

export const VideoLessonViewer: React.FC<VideoLessonViewerProps> = ({ 
  lesson, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState<'video' | 'interactive'>('video');
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [interactiveCompleted, setInteractiveCompleted] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);

  const handleVideoEnd = () => {
    setVideoCompleted(true);
    // Auto-advance to interactive if it exists
    if (lesson.interactiveType && lesson.interactiveType !== 'upsell') {
      setCurrentStep('interactive');
    } else if (lesson.interactiveType === 'upsell') {
      setShowUpsell(true);
    }
  };

  const handleVideoProgress = (progress: number) => {
    setVideoProgress(progress);
  };

  const handleInteractiveComplete = (success: boolean) => {
    setInteractiveCompleted(true);
    if (lesson.interactiveType === 'upsell') {
      setShowUpsell(true);
    }
    // Don't auto-complete lesson - wait for user to click Complete
  };

  const handleCompleteLesson = () => {
    onComplete(true);
  };

  const canProceedToInteractive = videoCompleted || videoProgress >= 90;
  const canCompleteLesson = videoCompleted && (!lesson.interactiveType || lesson.interactiveType === 'upsell' || interactiveCompleted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {lesson.title}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {lesson.description}
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {/* Video Step */}
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                videoCompleted ? 'bg-green-500' : currentStep === 'video' ? 'bg-blue-500' : 'bg-gray-600'
              }`}>
                {videoCompleted ? <CheckCircle className="w-6 h-6 text-white" /> : <span className="text-white font-bold">1</span>}
              </div>
              <span className="ml-2 text-white font-medium">Watch Video</span>
            </div>

            {/* Arrow */}
            {lesson.interactiveType && lesson.interactiveType !== 'upsell' && (
              <>
                <ArrowRight className="w-5 h-5 text-gray-400" />
                
                {/* Interactive Step */}
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    interactiveCompleted ? 'bg-green-500' : currentStep === 'interactive' ? 'bg-blue-500' : 'bg-gray-600'
                  }`}>
                    {interactiveCompleted ? <CheckCircle className="w-6 h-6 text-white" /> : <span className="text-white font-bold">2</span>}
                  </div>
                  <span className="ml-2 text-white font-medium">Interactive</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {currentStep === 'video' && (
            <motion.div
              key="video"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="max-w-4xl mx-auto"
            >
              <VideoPlayer
                src={lesson.videoUrl}
                title={lesson.title}
                onVideoEnd={handleVideoEnd}
                onProgress={handleVideoProgress}
              />

              {/* Video Controls */}
              <div className="mt-6 flex justify-between items-center">
                <div className="text-white">
                  <div className="text-sm opacity-75">Progress: {Math.round(videoProgress)}%</div>
                </div>

                <div className="flex space-x-4">
                  {canProceedToInteractive && lesson.interactiveType && lesson.interactiveType !== 'upsell' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentStep('interactive')}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <span>Continue to Interactive</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  )}

                  {canCompleteLesson && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCompleteLesson}
                      className="btn-primary bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                    >
                      <Trophy className="w-5 h-5" />
                      <span>Complete Lesson</span>
                      <Coins className="w-5 h-5" />
                      <span>+{lesson.reward.coins}</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'interactive' && lesson.interactiveType && (
            <motion.div
              key="interactive"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-4xl mx-auto"
            >
              {lesson.interactiveType === 'interactive-exercise' && (
                <InteractiveSection
                  data={lesson.interactiveData}
                  onComplete={handleInteractiveComplete}
                />
              )}

              {(lesson.interactiveType === 'block-builder' || 
                lesson.interactiveType === 'security-checker' || 
                lesson.interactiveType === 'investment-simulator') && (
                <MiniGame
                  type={lesson.interactiveType}
                  data={lesson.interactiveData}
                  onComplete={handleInteractiveComplete}
                />
              )}

              {/* Interactive Controls */}
              <div className="mt-6 flex justify-between items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep('video')}
                  className="btn-secondary"
                >
                  Back to Video
                </motion.button>

                {interactiveCompleted && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCompleteLesson}
                    className="btn-primary bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Trophy className="w-5 h-5" />
                    <span>Complete Lesson</span>
                    <Coins className="w-5 h-5" />
                    <span>+{lesson.reward.coins}</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upsell Modal */}
        {showUpsell && (
          <UpsellModal
            onClose={() => setShowUpsell(false)}
            onJoin={() => {
              console.log('User wants to join Invest+ community');
              setShowUpsell(false);
            }}
          />
        )}
      </div>
    </div>
  );
};
