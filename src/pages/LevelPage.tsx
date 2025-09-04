import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, CheckCircle, Lock, Clock, Star, Coins } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { badges } from '../data/gameData';
import { telegram } from '../utils/telegram';
import { GameCard } from '../components/ui/GameCard';
import { ProgressBar } from '../components/ui/ProgressBar';

interface LevelPageProps {
  levelId: number;
  onBack: () => void;
  onLessonSelect: (lessonId: string) => void;
}

export const LevelPage: React.FC<LevelPageProps> = ({ levelId, onBack, onLessonSelect }) => {
  const { levels } = useGameStore();
  
  const level = levels.find(l => l.id === levelId);

  useEffect(() => {
    // Set up Telegram back button
    telegram.setBackButton(onBack);
    
    return () => {
      telegram.hideBackButton();
    };
  }, [onBack]);

  if (!level) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Level Not Found</h2>
          <button
            onClick={onBack}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const completedLessons = level.lessons.filter(lesson => lesson.isCompleted).length;
  const totalLessons = level.lessons.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>
          
          <div className="flex-1">
            <motion.h1
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Level {level.id}: {level.title}
            </motion.h1>
            <motion.p
              className="text-gray-300 text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {level.description}
            </motion.p>
          </div>
        </div>

        {/* Level Progress */}
        <motion.div
          className="bg-gradient-to-br from-purple-900/30 to-blue-800/30 rounded-2xl p-6 border border-purple-500/30 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Your Progress</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">
                  {level.lessons.reduce((acc, lesson) => acc + lesson.estimatedTime, 0)} min total
                </span>
              </div>
            </div>
          </div>
          
          <ProgressBar
            current={completedLessons}
            max={totalLessons}
            label={`${completedLessons} / ${totalLessons} lessons completed`}
            color="purple"
          />

          {level.isCompleted && (
            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-xl font-bold text-green-400">Level Complete! 🎉</span>
                </div>
                <div className="flex justify-center items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">+{level.reward.coins} coins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 font-semibold">+{level.reward.experience} XP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Lessons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Lessons</h2>
          
          {level.lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GameCard
                title={lesson.title}
                description={lesson.description}
                isLocked={!lesson.isUnlocked}
                isCompleted={lesson.isCompleted}
                reward={lesson.reward}
                onClick={() => lesson.isUnlocked && onLessonSelect(lesson.id)}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.estimatedTime} min</span>
                    </div>
                    {lesson.quiz && (
                      <span className="bg-blue-600/20 px-2 py-1 rounded text-blue-300">
                        📝 Quiz included
                      </span>
                    )}
                    {lesson.miniGame && (
                      <span className="bg-green-600/20 px-2 py-1 rounded text-green-300">
                        🎮 Mini-game
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {lesson.isCompleted ? (
                      <div className="flex items-center gap-1 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Done</span>
                      </div>
                    ) : lesson.isUnlocked ? (
                      <motion.button
                        className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onLessonSelect(lesson.id);
                        }}
                      >
                        <Play className="w-4 h-4" />
                        <span>Start</span>
                      </motion.button>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Lock className="w-4 h-4" />
                        <span>Locked</span>
                      </div>
                    )}
                  </div>
                </div>
              </GameCard>
            </motion.div>
          ))}
        </div>

        {/* Level Reward Preview */}
        {!level.isCompleted && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="bg-gradient-to-br from-yellow-900/30 to-orange-800/30 rounded-2xl p-6 border border-yellow-500/30">
              <h3 className="text-xl font-bold text-white mb-3">🏆 Level Completion Reward</h3>
              <p className="text-gray-300 mb-4">Complete all lessons to earn:</p>
              
              <div className="flex justify-center items-center gap-6">
                <div className="flex items-center gap-2">
                  <Coins className="w-6 h-6 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-xl">{level.reward.coins} coins</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-blue-400" />
                  <span className="text-blue-400 font-bold text-xl">{level.reward.experience} XP</span>
                </div>
                {level.reward.badges && level.reward.badges.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{badges.find(b => b.id === level.reward.badges![0])?.icon || '🏆'}</span>
                    <span className="text-purple-400 font-bold">Special Badge</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
