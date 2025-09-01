import React from 'react';
import { motion } from 'framer-motion';
import { X, Star, Users, TrendingUp, Shield, Zap } from 'lucide-react';
import { telegram } from '../../utils/telegram';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: 'level-complete' | 'all-complete' | 'manual';
}

export const UpsellModal: React.FC<UpsellModalProps> = ({ isOpen, onClose, trigger }) => {
  if (!isOpen) return null;

  const handleJoinCommunity = () => {
    telegram.hapticFeedback('success');
    telegram.openTelegramLink('https://t.me/lynnyk_ruslan');
  };

  const handleLearnMore = () => {
    telegram.openLink('https://majinxlabs.io/');
  };

  const getContent = () => {
    switch (trigger) {
      case 'all-complete':
        return {
          title: '🎉 Congratulations, Crypto Master!',
          subtitle: 'You\'ve completed all levels! Ready for the next step?',
          highlight: 'Exclusive Access Unlocked!'
        };
      case 'level-complete':
        return {
          title: '🚀 Great Progress!',
          subtitle: 'You\'re becoming a crypto expert. Want to accelerate your journey?',
          highlight: 'Level Up Your Learning'
        };
      default:
        return {
          title: '💎 Join the Elite',
          subtitle: 'Take your crypto knowledge to professional level',
          highlight: 'Invest+ Community'
        };
    }
  };

  const content = getContent();

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl p-6 max-w-md w-full border border-purple-500/30 relative"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <motion.h2
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {content.title}
          </motion.h2>
          <motion.p
            className="text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {content.subtitle}
          </motion.p>
        </div>

        {/* Highlight Badge */}
        <motion.div
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 px-4 rounded-full mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="font-semibold">{content.highlight}</span>
        </motion.div>

        {/* Features */}
        <div className="space-y-4 mb-6">
          {[
            { icon: Users, text: 'Exclusive community of 10,000+ investors', color: 'text-blue-400' },
            { icon: TrendingUp, text: 'Professional market analysis & insights', color: 'text-green-400' },
            { icon: Shield, text: 'Verified investment strategies & tips', color: 'text-purple-400' },
            { icon: Zap, text: 'Real-time alerts & portfolio guidance', color: 'text-yellow-400' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <feature.icon className={`w-5 h-5 ${feature.color}`} />
              <span className="text-gray-300 text-sm">{feature.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Pricing */}
        <motion.div
          className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center">
            <div className="text-gray-400 text-sm line-through">$99/month</div>
            <div className="text-2xl font-bold text-white">$49/month</div>
            <div className="text-green-400 text-sm font-semibold">50% OFF for app users!</div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-200 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleJoinCommunity}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Star className="w-5 h-5" />
            <span>Join Invest+ Community</span>
          </motion.button>

          <motion.button
            className="w-full bg-transparent border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-white font-medium py-2 px-6 rounded-full transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLearnMore}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            Learn More
          </motion.button>
        </div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-4 text-center text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <div className="flex items-center justify-center gap-4">
            <span>🔒 Secure Payment</span>
            <span>📱 Cancel Anytime</span>
            <span>⭐ 4.9/5 Rating</span>
          </div>
        </motion.div>

        {/* Sparkle Effects */}
        <div className="absolute -top-2 -right-2 text-yellow-400 animate-pulse">✨</div>
        <div className="absolute -bottom-2 -left-2 text-blue-400 animate-pulse" style={{ animationDelay: '1s' }}>💎</div>
      </motion.div>
    </motion.div>
  );
};
