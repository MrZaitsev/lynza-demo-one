import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Coins, CheckCircle } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  isLocked?: boolean;
  isCompleted?: boolean;
  progress?: number;
  reward?: {
    coins: number;
    experience: number;
  };
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  isLocked = false,
  isCompleted = false,
  progress = 0,
  reward,
  onClick,
  className = '',
  children
}) => {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-3xl p-6 cursor-pointer transition-all duration-500 group
        ${isLocked 
          ? 'glass opacity-50 hover:opacity-70' 
          : isCompleted
          ? 'bg-gradient-to-br from-green-900/30 to-emerald-800/30 border-2 border-green-500/40 hover:border-green-400/60 shadow-xl hover:shadow-green-500/20'
          : 'glass hover:bg-white/10 border-2 border-white/10 hover:border-purple-500/50 shadow-xl hover:shadow-purple-500/20'
        }
        ${className}
      `}
      whileHover={!isLocked ? { y: -4, scale: 1.02 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={!isLocked ? onClick : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Floating Particles */}
      {!isLocked && (
        <>
          <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-float"></div>
          <div className="absolute bottom-6 left-6 w-1 h-1 bg-blue-400 rounded-full opacity-40 animate-float" style={{animationDelay: '1s'}}></div>
        </>
      )}

      {/* Status Icon */}
      <div className="absolute top-4 right-4 z-10">
        {isCompleted ? (
          <motion.div
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-5 h-5 text-white" />
          </motion.div>
        ) : isLocked ? (
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-white/50" />
          </div>
        ) : null}
      </div>

      <div className="relative z-10">
        {/* Title and Description */}
        <div className="mb-6">
          <h3 className={`text-xl font-bold mb-2 ${isLocked ? 'text-white/60' : 'text-white'}`}>
            {title}
          </h3>
          <p className={`text-sm leading-relaxed ${isLocked ? 'text-white/50' : 'text-white/70'}`}>
            {description}
          </p>
        </div>

        {/* Progress Bar */}
        {progress > 0 && !isCompleted && !isLocked && (
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-white/80 font-medium">Progress</span>
              <span className="text-white/60">{Math.round(progress)}%</span>
            </div>
            <div className="relative">
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* Rewards */}
        {reward && !isLocked && (
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-semibold">{reward.coins}</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-semibold">{reward.experience} XP</span>
            </motion.div>
          </div>
        )}

        {/* Custom Content */}
        {children}

        {/* Completion Celebration */}
        {isCompleted && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-2 left-2 text-green-400 animate-float">✨</div>
            <div className="absolute top-4 right-12 text-emerald-400 animate-float" style={{animationDelay: '0.5s'}}>⭐</div>
            <div className="absolute bottom-4 left-8 text-green-300 animate-float" style={{animationDelay: '1s'}}>💫</div>
          </motion.div>
        )}
      </div>

      {/* Hover Glow Effect */}
      {!isLocked && (
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className={`absolute inset-0 rounded-3xl ${
            isCompleted 
              ? 'bg-gradient-to-r from-green-500/10 via-emerald-500/20 to-green-500/10'
              : 'bg-gradient-to-r from-purple-500/10 via-blue-500/20 to-purple-500/10'
          }`} />
        </div>
      )}
    </motion.div>
  );
};