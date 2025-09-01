import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Star, Trophy, TrendingUp, Award, Target, Zap } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';


export const UserProfile: React.FC = () => {
  const { user } = useGameStore();

  // Calculate level progress (simple formula for demo)
  const currentLevelXP = user.level * 100;
  const nextLevelXP = (user.level + 1) * 100;
  const progressToNextLevel = Math.max(0, Math.min(100, ((user.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Profile Card */}
      <motion.div
        className="lg:col-span-2 glass-card relative overflow-hidden"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          {/* Profile Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-slate-900">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </motion.div>
              
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300 font-medium text-sm">Level {user.level}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-500/30">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 font-medium text-sm">Crypto Explorer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Currency Display */}
            <div className="text-right">
              <motion.div
                key={user.coins}
                className="flex items-center justify-end gap-2 mb-2"
                initial={{ scale: 1.2, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Coins className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold text-yellow-400">
                  {user.coins.toLocaleString()}
                </span>
              </motion.div>
              <div className="flex items-center justify-end gap-2">
                <Star className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-semibold">{user.experience} XP</span>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/90 font-medium">Progress to Level {user.level + 1}</span>
              <span className="text-white/70 text-sm">{Math.round(progressToNextLevel)}%</span>
            </div>
            <div className="relative">
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLevel}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </motion.div>
              </div>
              <div className="absolute -top-1 left-0 w-5 h-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg"></div>
            </div>
          </div>

          {/* Achievement Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { 
                icon: Target, 
                value: user.completedLessons.length, 
                label: 'Lessons', 
                color: 'text-green-400',
                bgColor: 'from-green-500/20 to-emerald-500/20',
                borderColor: 'border-green-500/30'
              },
              { 
                icon: Award, 
                value: user.badges.length, 
                label: 'Badges', 
                color: 'text-purple-400',
                bgColor: 'from-purple-500/20 to-pink-500/20',
                borderColor: 'border-purple-500/30'
              },
              { 
                icon: Trophy, 
                value: user.unlockedLevels.length, 
                label: 'Levels', 
                color: 'text-orange-400',
                bgColor: 'from-orange-500/20 to-red-500/20',
                borderColor: 'border-orange-500/30'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`text-center p-4 rounded-2xl bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-white/70 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Badges */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-warning flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Recent Badges</h3>
        </div>
        
        {user.badges.length > 0 ? (
          <div className="space-y-4">
            {user.badges
              .sort((a, b) => {
                const aTime = a.earnedAt ? (typeof a.earnedAt === 'string' ? new Date(a.earnedAt).getTime() : a.earnedAt.getTime()) : 0;
                const bTime = b.earnedAt ? (typeof b.earnedAt === 'string' ? new Date(b.earnedAt).getTime() : b.earnedAt.getTime()) : 0;
                return bTime - aTime;
              })
              .slice(0, 4)
              .map((badge, index) => (
                <motion.div
                  key={badge.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-lg">
                    {badge.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{badge.name}</h4>
                    <p className="text-white/60 text-sm truncate">{badge.description}</p>
                  </div>
                  {badge.earnedAt && Date.now() - (typeof badge.earnedAt === 'string' ? new Date(badge.earnedAt).getTime() : badge.earnedAt.getTime()) < 24 * 60 * 60 * 1000 && (
                    <div className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                      <span className="text-white text-xs font-medium">NEW</span>
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <Award className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-white/60">Complete lessons to earn badges!</p>
          </div>
        )}
        
        {user.badges.length > 4 && (
          <div className="mt-4 text-center">
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              View all {user.badges.length} badges →
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};