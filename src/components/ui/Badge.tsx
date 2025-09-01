import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  icon: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned?: boolean;
  earnedAt?: Date;
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  icon,
  name,
  description,
  rarity,
  earned = false,
  earnedAt,
  size = 'md',
  showAnimation = true
}) => {
  const rarityColors = {
    common: 'from-gray-500 to-gray-600 border-gray-400',
    rare: 'from-blue-500 to-blue-600 border-blue-400',
    epic: 'from-purple-500 to-purple-600 border-purple-400',
    legendary: 'from-yellow-500 to-orange-500 border-yellow-400'
  };

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl'
  };

  const containerSizes = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <motion.div
      className={`relative ${containerSizes[size]} ${earned ? 'opacity-100' : 'opacity-50'}`}
      initial={showAnimation ? { scale: 0, rotate: -180 } : { scale: 1 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: showAnimation ? 0.2 : 0
      }}
      whileHover={{ scale: 1.1 }}
    >
      {/* Glow effect for legendary badges */}
      {earned && rarity === 'legendary' && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/30 to-orange-400/30 animate-pulse blur-lg" />
      )}

      {/* Badge circle */}
      <div
        className={`
          relative ${sizeClasses[size]} rounded-full
          bg-gradient-to-br ${rarityColors[rarity]}
          border-2 flex items-center justify-center
          ${earned ? 'shadow-lg' : 'grayscale'}
          transition-all duration-300
        `}
      >
        <span className="text-white drop-shadow-lg">{icon}</span>
        
        {/* Sparkle animation for earned badges */}
        {earned && (
          <>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          </>
        )}
      </div>

      {/* Badge info tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg border border-gray-700">
          <div className="font-semibold">{name}</div>
          <div className="text-gray-300">{description}</div>
          {earned && earnedAt && (
            <div className="text-gray-400 text-xs mt-1">
              Earned {typeof earnedAt === 'string' ? new Date(earnedAt).toLocaleDateString() : earnedAt.toLocaleDateString()}
            </div>
          )}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      </div>

      {/* New badge indicator */}
      {earned && earnedAt && Date.now() - (typeof earnedAt === 'string' ? new Date(earnedAt).getTime() : earnedAt.getTime()) < 24 * 60 * 60 * 1000 && (
        <motion.div
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          NEW
        </motion.div>
      )}
    </motion.div>
  );
};
