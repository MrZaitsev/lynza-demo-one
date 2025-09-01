import React from 'react';
import { motion } from 'framer-motion';
import { Play, Lock, CheckCircle, Clock, Star, Coins, ArrowRight, BookOpen } from 'lucide-react';
import type { Level } from '../../types/game';

interface LevelOverviewProps {
  levels: Level[];
  onLevelClick: (levelId: number) => void;
}

export const LevelOverview: React.FC<LevelOverviewProps> = ({ levels, onLevelClick }) => {
  return (
    <div className="space-y-8">
      {/* Level Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {levels.map((level, index) => {
          const completedLessons = level.lessons.filter(lesson => lesson.isCompleted).length;
          const totalLessons = level.lessons.length;
          const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
          const totalTime = level.lessons.reduce((acc, lesson) => acc + lesson.estimatedTime, 0);

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div
                className={`
                  relative overflow-hidden rounded-3xl p-6 cursor-pointer transition-all duration-500 h-full
                  ${!level.isUnlocked 
                    ? 'glass opacity-50 hover:opacity-70' 
                    : level.isCompleted
                    ? 'bg-gradient-to-br from-green-900/40 to-emerald-800/40 border-2 border-green-500/50 hover:border-green-400/70 shadow-xl hover:shadow-green-500/20'
                    : 'glass hover:bg-white/10 border-2 border-white/10 hover:border-purple-500/50 shadow-xl hover:shadow-purple-500/20'
                  }
                `}
                onClick={() => level.isUnlocked && onLevelClick(level.id)}
              >
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Level Number Badge */}
                <div className="absolute top-4 right-4">
                  {level.isCompleted ? (
                    <motion.div
                      className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CheckCircle className="w-6 h-6 text-white" />
                    </motion.div>
                  ) : level.isUnlocked ? (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">{level.id}</span>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white/50" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        level.isCompleted 
                          ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30'
                          : level.isUnlocked 
                          ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30'
                          : 'bg-white/5 border border-white/10'
                      }`}>
                        <BookOpen className={`w-6 h-6 ${
                          level.isCompleted ? 'text-green-400' : level.isUnlocked ? 'text-purple-400' : 'text-white/40'
                        }`} />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${!level.isUnlocked ? 'text-white/60' : 'text-white'}`}>
                          Level {level.id}
                        </h3>
                        <p className="text-purple-300 font-medium">{level.title}</p>
                      </div>
                    </div>
                    
                    <p className={`text-sm leading-relaxed ${!level.isUnlocked ? 'text-white/50' : 'text-white/70'}`}>
                      {level.description}
                    </p>
                  </div>

                  {/* Progress Section */}
                  {level.isUnlocked && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80 text-sm font-medium">Progress</span>
                        <span className="text-white/60 text-sm">{completedLessons}/{totalLessons} lessons</span>
                      </div>
                      <div className="relative">
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              level.isCompleted 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-gradient-to-r from-purple-500 to-blue-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-white/60" />
                      <span className="text-white/60">{totalTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">{level.reward.coins}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-semibold">{level.reward.experience} XP</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    {level.isCompleted ? (
                      <div className="flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-semibold">Completed</span>
                      </div>
                    ) : level.isUnlocked ? (
                      <motion.button
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onLevelClick(level.id);
                        }}
                      >
                        <Play className="w-5 h-5" />
                        <span>{completedLessons > 0 ? 'Continue' : 'Start Level'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-white/5 border border-white/10">
                        <Lock className="w-4 h-4 text-white/50" />
                        <span className="text-white/50 font-medium">
                          Complete Level {level.requiredLevel} to unlock
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Bonus */}
      <motion.div
        className="glass-card max-w-4xl mx-auto relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-2xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center animate-glow">
              <span className="text-2xl">🏆</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Master All Levels</h2>
          </div>
          
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Complete all 5 levels to become a certified <span className="text-gradient font-bold">Blockchain Expert</span> and unlock exclusive rewards!
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-bold">1,500 Bonus Coins</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-blue-400" />
              <span className="text-blue-400 font-bold">Master Badge</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <span className="text-gradient font-bold">Invest+ Access</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};