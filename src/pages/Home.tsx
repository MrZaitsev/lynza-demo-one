import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { telegram } from '../utils/telegram';
import { clearStorageIfCorrupted } from '../utils/storage';
import { UserProfile } from '../components/game/UserProfile';
import { LevelOverview } from '../components/game/LevelOverview';
import { UpsellModal } from '../components/game/UpsellModal';

interface HomeProps {
  onLevelSelect: (levelId: number) => void;
}

export const Home: React.FC<HomeProps> = ({ onLevelSelect }) => {
  const { user, levels, initializeUser } = useGameStore();
  const [showUpsell, setShowUpsell] = useState(false);

  // Check if all levels are completed
  const allLevelsCompleted = levels.every(level => level.isCompleted);

  useEffect(() => {
    console.log('Home useEffect running');
    
    // Clear corrupted storage if needed
    clearStorageIfCorrupted();
    
    // Initialize user from Telegram data
    const telegramUser = telegram.getUser();
    console.log('Got telegram user:', telegramUser);
    initializeUser(telegramUser);

    // Set up Telegram back button
    telegram.hideBackButton();
    telegram.hideMainButton();
  }, [initializeUser]);

  // Simple fallback if user name is empty
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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center animate-glow">
              <span className="text-2xl">🎓</span>
            </div>
            <h1 className="text-5xl font-bold text-gradient">
              Lynza Crypto Academy
            </h1>
          </div>
          
          <motion.p
            className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Master blockchain and cryptocurrency through gamified micro-learning with Lynza. 
            <span className="text-gradient font-semibold"> Earn rewards, unlock achievements, and become a crypto expert!</span>
          </motion.p>
        </motion.div>

        {/* User Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <UserProfile />
        </motion.div>

        {/* Welcome Back Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="glass-card max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-3xl animate-float">👋</span>
              <h2 className="text-2xl font-bold text-white">
                Welcome back, {user.name}!
              </h2>
            </div>
            <p className="text-white/70 text-lg">
              {allLevelsCompleted 
                ? "🎉 Congratulations! You've mastered all levels. Ready for the next step?"
                : `Continue your journey through ${levels.length} expertly crafted levels`
              }
            </p>
          </div>
        </motion.div>

        {/* Learning Path */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center">
              <span className="text-lg">🛤️</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Your Learning Path</h2>
          </div>
          
          <LevelOverview levels={levels} onLevelClick={onLevelSelect} />
        </motion.div>

        {/* Premium Upsell Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="glass-card max-w-4xl mx-auto relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-4xl animate-float">🚀</span>
                <h3 className="text-3xl font-bold text-white">
                  {allLevelsCompleted ? 'Congratulations, Master!' : 'Ready for More?'}
                </h3>
              </div>
              
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                {allLevelsCompleted 
                  ? 'You\'ve mastered all levels! Unlock exclusive access to our professional crypto community.'
                  : 'Complete all levels to unlock exclusive Invest+ community access with expert insights and strategies.'
                }
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: '💬', label: 'Expert Community', color: 'from-purple-500 to-pink-500' },
                  { icon: '📊', label: 'Pro Analysis', color: 'from-blue-500 to-cyan-500' },
                  { icon: '🎯', label: 'Investment Strategies', color: 'from-green-500 to-teal-500' },
                  { icon: '📈', label: 'Market Insights', color: 'from-orange-500 to-red-500' }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.label}
                    className="glass rounded-xl p-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                      <span className="text-xl">{feature.icon}</span>
                    </div>
                    <p className="text-white/90 font-medium text-sm">{feature.label}</p>
                  </motion.div>
                ))}
              </div>
              
              {allLevelsCompleted && (
                <motion.button
                  className="btn-primary text-lg px-12 py-4"
                  onClick={() => setShowUpsell(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <span className="flex items-center gap-2">
                    <span>🌟</span>
                    Join Invest+ Community
                    <span>→</span>
                  </span>
                </motion.button>
              )}
              
              {!allLevelsCompleted && (
                <div className="flex items-center justify-center gap-2 text-white/60">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                  <span className="text-sm">Complete all levels to unlock</span>
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Upsell Modal */}
        <UpsellModal
          isOpen={showUpsell}
          onClose={() => setShowUpsell(false)}
          trigger={allLevelsCompleted ? 'all-complete' : 'manual'}
        />
      </div>
    </div>
  );
};