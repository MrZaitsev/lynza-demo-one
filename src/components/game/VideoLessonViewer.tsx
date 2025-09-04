import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, ArrowLeft, Trophy, Coins } from 'lucide-react';
import type { VideoLesson } from '../../types/game';
import { VideoPlayer } from './VideoPlayer';
import { VideoInteractive } from './VideoInteractive';
import { MiniGame } from './MiniGame';
import { UpsellModal } from './UpsellModal';

interface VideoLessonViewerProps {
  lesson: VideoLesson;
  onComplete: (success: boolean) => void;
  onBack: () => void;
}

export const VideoLessonViewer: React.FC<VideoLessonViewerProps> = ({ 
  lesson, 
  onComplete,
  onBack 
}) => {
  const [currentStep, setCurrentStep] = useState<'video' | 'interactive'>('video');
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [interactiveCompleted, setInteractiveCompleted] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);

  const handleVideoEnd = () => {
    setVideoCompleted(true);
    // Don't auto-advance - let user choose what to do next
  };

  const handleVideoProgress = (progress: number) => {
    setVideoProgress(progress);
  };

  const handleInteractiveComplete = (success: boolean) => {
    setInteractiveCompleted(true);
    if (lesson.interactiveType === 'upsell') {
      setShowUpsell(true);
    }
    // Complete the lesson immediately after interactive completion
    if (success && videoCompleted) {
      handleCompleteLesson();
    }
  };

  const handleCompleteLesson = () => {
    onComplete(true);
  };

  const canProceedToInteractive = videoCompleted;
  const canCompleteLesson = videoCompleted && (!lesson.interactiveType || lesson.interactiveType === 'upsell' || interactiveCompleted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          {/* Back Button */}
          <motion.button
            onClick={onBack}
            className="mb-4 sm:mb-6 flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back to Home</span>
          </motion.button>

          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">
              {lesson.title}
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto px-4">
              {lesson.description}
            </p>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Video Step */}
            <div className="flex items-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                videoCompleted ? 'bg-green-500' : currentStep === 'video' ? 'bg-blue-500' : 'bg-gray-600'
              }`}>
                {videoCompleted ? <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" /> : <span className="text-white font-bold text-sm sm:text-base">1</span>}
              </div>
              <span className="ml-1 sm:ml-2 text-white font-medium text-sm sm:text-base">Watch Video</span>
            </div>

            {/* Arrow */}
            {lesson.interactiveType && lesson.interactiveType !== 'upsell' && (
              <>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                
                {/* Interactive Step */}
                <div className="flex items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                    interactiveCompleted ? 'bg-green-500' : currentStep === 'interactive' ? 'bg-blue-500' : 'bg-gray-600'
                  }`}>
                    {interactiveCompleted ? <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" /> : <span className="text-white font-bold text-sm sm:text-base">2</span>}
                  </div>
                  <span className="ml-1 sm:ml-2 text-white font-medium text-sm sm:text-base">Interactive</span>
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
              <div className="mt-4 sm:mt-6">
                <div className="text-white mb-4">
                  <div className="text-xs sm:text-sm opacity-75 text-center">Progress: {Math.round(videoProgress)}%</div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {canProceedToInteractive && lesson.interactiveType && lesson.interactiveType !== 'upsell' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentStep('interactive')}
                      className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center"
                    >
                      <span className="text-sm sm:text-base">Continue to Interactive</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  )}

                  {canCompleteLesson && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCompleteLesson}
                      className="btn-primary bg-green-600 hover:bg-green-700 flex items-center space-x-2 w-full sm:w-auto justify-center"
                    >
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Complete Lesson</span>
                      <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
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
                <VideoInteractive
                  data={lesson.interactiveData || {}}
                  onComplete={handleInteractiveComplete}
                  onBack={() => setCurrentStep('video')}
                />
              )}

              {(lesson.interactiveType === 'block-builder' || 
                lesson.interactiveType === 'security-checker' || 
                lesson.interactiveType === 'investment-simulator') && (
                <MiniGame
                  type={lesson.interactiveType}
                  data={lesson.interactiveData}
                  onComplete={handleInteractiveComplete}
                  onBack={() => setCurrentStep('video')}
                />
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* Upsell Modal */}
        <UpsellModal
          isOpen={showUpsell}
          onClose={() => setShowUpsell(false)}
          trigger="manual"
        />
      </div>
    </div>
  );
};
