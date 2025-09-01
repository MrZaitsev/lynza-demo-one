import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showNumbers?: boolean;
  color?: 'purple' | 'blue' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  label,
  showNumbers = true,
  color = 'purple',
  size = 'md',
  className = ''
}) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  const colorClasses = {
    purple: 'from-purple-500 to-blue-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-yellow-500 to-orange-500',
    red: 'from-red-500 to-pink-500'
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showNumbers) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-300">{label}</span>
          )}
          {showNumbers && (
            <span className="text-sm text-gray-400">
              {current} / {max}
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer" />
        </motion.div>
      </div>
      
      {percentage === 100 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex justify-center mt-2"
        >
          <span className="text-green-400 text-sm font-semibold">✨ Complete! ✨</span>
        </motion.div>
      )}
    </div>
  );
};
