import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Lock, CheckCircle, Trophy, Coins, Star } from 'lucide-react';
import type { VideoLesson } from '../types/game';
import { useGameStore } from '../store/gameStore';
import { telegram } from '../utils/telegram';
import { clearStorageIfCorrupted } from '../utils/storage';

interface HomeProps {
  onStartLesson: (lesson: VideoLesson) => void;
}

export const Home: React.FC<HomeProps> = ({ onStartLesson }) => {
  const { user, videoLessons, initializeUser } = useGameStore();

  useEffect(() => {
    console.log('Home useEffect running');
    
    // Clear corrupted storage if needed
    clearStorageIfCorrupted();
    
    // Initialize user from Telegram data
    const telegramUser = telegram.getUser();
    console.log('Got telegram user:', telegramUser);
    initializeUser(telegramUser || null);

    // Set up Telegram back button
    telegram.hideBackButton();
    telegram.hideMainButton();
  }, [initializeUser]);

  // Show loading if user name is empty
  if (!user.name) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass-card max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center animate-glow">
              <span className="text-2xl">🚀</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Crypto Learning Adventure
            </h1>
            <p className="text-white/70 mb-6">
              Initializing your learning journey...
            </p>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentLesson = videoLessons.find(l => l.isUnlocked && !l.isCompleted);
  const completedLessons = videoLessons.filter(l => l.isCompleted).length;
  const totalLessons = videoLessons.length;
  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl gradient-primary flex items-center justify-center animate-glow">
              <span className="text-xl sm:text-2xl">🎓</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gradient">
              Welcome, {user.name}! 👋
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed px-2">
            Your Crypto Learning Adventure
          </p>
        </motion.div>

        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
            <div>
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">{user.level}</div>
              <div className="text-white/60 text-xs sm:text-sm">Level</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Coins className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">{user.coins}</div>
              <div className="text-white/60 text-xs sm:text-sm">Coins</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">{user.experience}</div>
              <div className="text-white/60 text-xs sm:text-sm">XP</div>
            </div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Your Progress</h2>
          <div className="mb-4">
            <div className="flex justify-between text-white mb-2 text-sm sm:text-base">
              <span>Lessons Completed</span>
              <span>{completedLessons} / {totalLessons}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 sm:h-3 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Current Lesson - Big CTA */}
        {currentLesson && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 sm:p-8 mb-6 sm:mb-8 text-center relative overflow-hidden"
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Ready for your next lesson?</h2>
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-300 mb-2">{currentLesson.title}</h3>
                <p className="text-white/70 text-sm sm:text-base px-2">{currentLesson.description}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onStartLesson(currentLesson)}
                className="btn-primary text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 flex items-center space-x-2 sm:space-x-3 mx-auto"
              >
                <Play className="w-6 h-6 sm:w-8 sm:h-8" />
                <span>Start Learning</span>
                <div className="flex items-center space-x-1">
                  <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>+{currentLesson.reward.coins}</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* All Lessons Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-4 sm:p-6"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl gradient-secondary flex items-center justify-center">
              <span className="text-base sm:text-lg">🛤️</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Learning Path</h2>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {videoLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
                  lesson.isCompleted
                    ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                    : lesson.isUnlocked
                    ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                    : 'bg-gray-500/10 border-gray-500/30'
                }`}
              >
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    lesson.isCompleted
                      ? 'bg-green-500'
                      : lesson.isUnlocked
                      ? 'bg-blue-500'
                      : 'bg-gray-500'
                  }`}>
                    {lesson.isCompleted ? (
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    ) : lesson.isUnlocked ? (
                      <span className="text-white font-bold text-sm sm:text-base">{index + 1}</span>
                    ) : (
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">{lesson.title}</h3>
                    <p className="text-xs sm:text-sm text-white/60 line-clamp-2">{lesson.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">{lesson.reward.coins}</span>
                  </div>
                  
                  {lesson.isUnlocked && !lesson.isCompleted && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onStartLesson(lesson)}
                      className="btn-primary px-3 py-2 text-xs sm:text-sm rounded-lg"
                    >
                      Start
                    </motion.button>
                  )}
                  
                  {lesson.isCompleted && (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <div className="text-green-400 text-xs sm:text-sm font-medium hidden sm:block">✅ Completed</div>
                      <div className="text-green-400 text-xs font-medium sm:hidden">✅</div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onStartLesson(lesson)}
                        className="btn-secondary px-3 py-2 text-xs sm:text-sm rounded-lg"
                      >
                        Replay
                      </motion.button>
                    </div>
                  )}
                  
                  {!lesson.isUnlocked && (
                    <div className="text-gray-400 text-xs sm:text-sm font-medium">🔒 Locked</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};