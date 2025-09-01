import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, Sparkles } from 'lucide-react';
import type { ContentSection } from '../../types/game';
import { telegram } from '../../utils/telegram';

interface InteractiveSectionProps {
  section: ContentSection;
}

// Property explanations for money properties
const PROPERTY_EXPLANATIONS: Record<string, { 
  title: string; 
  description: string; 
  example: string;
  icon: string;
}> = {
  'Durable': {
    title: 'Durable',
    description: 'Money must last a long time without deteriorating',
    example: 'Gold coins lasted thousands of years, but fruit would rot quickly',
    icon: '🛡️'
  },
  'Portable': {
    title: 'Portable',
    description: 'Easy to carry and transport for trade',
    example: 'Coins fit in your pocket, but cattle are hard to carry around',
    icon: '🎒'
  },
  'Divisible': {
    title: 'Divisible',
    description: 'Can be broken into smaller units for different sized purchases',
    example: 'You can make change with coins, but you can\'t split a diamond easily',
    icon: '✂️'
  },
  'Uniform': {
    title: 'Uniform',
    description: 'Every unit is the same, so people trust its value',
    example: 'All $1 bills are worth exactly the same, unlike unique artwork',
    icon: '📏'
  },
  'Limited Supply': {
    title: 'Limited Supply',
    description: 'Scarcity makes money valuable - too much causes inflation',
    example: 'Gold is rare and valuable, but sand is everywhere and worthless',
    icon: '💎'
  },
  'Acceptable': {
    title: 'Acceptable',
    description: 'People must agree to accept it as payment',
    example: 'Everyone accepts dollars at stores, but not everyone accepts Pokemon cards',
    icon: '🤝'
  }
};

export const InteractiveSection: React.FC<InteractiveSectionProps> = ({ section }) => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [exploredProperties, setExploredProperties] = useState<Set<string>>(new Set());

  const handlePropertyClick = (property: string) => {
    setSelectedProperty(property);
    setExploredProperties(prev => new Set([...prev, property]));
    telegram.hapticFeedback('medium');
  };

  const closeModal = () => {
    setSelectedProperty(null);
    telegram.hapticFeedback('light');
  };

  if (!section.interactive || section.interactive.type !== 'drag-drop') {
    return (
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
        <p className="text-gray-300 mb-6">{section.content}</p>
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
          <p className="text-gray-400">Interactive content not available</p>
        </div>
      </div>
    );
  }

  const properties = section.interactive.data.properties || [];
  const allExplored = properties.every((prop: string) => exploredProperties.has(prop));

  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
      <p className="text-gray-300 mb-6">{section.content}</p>
      
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h4 className="text-lg font-semibold text-white">Interactive Exercise</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          {properties.map((prop: string) => {
            const isExplored = exploredProperties.has(prop);
            
            return (
              <motion.div
                key={prop}
                className={`relative border rounded-lg p-4 text-center cursor-pointer transition-all duration-200 ${
                  isExplored
                    ? 'bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/50'
                    : 'bg-purple-600/20 border-purple-500/50 hover:border-purple-400/70'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePropertyClick(prop)}
              >
                {isExplored && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className="text-2xl mb-2">
                  {PROPERTY_EXPLANATIONS[prop]?.icon || '💰'}
                </div>
                <span className="text-white font-medium">{prop}</span>
                
                {!isExplored && (
                  <motion.div
                    className="mt-2 flex items-center justify-center gap-1 text-purple-300 text-xs"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Info className="w-3 h-3" />
                    <span>Tap to explore</span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-400">
            💡 Tap the properties to learn what makes good money!
          </p>
          <div className="text-purple-300">
            {exploredProperties.size}/{properties.length} explored
          </div>
        </div>
        
        {allExplored && (
          <motion.div
            className="mt-4 p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="font-semibold text-green-300">Excellent work!</span>
            </div>
            <p className="text-green-200 text-sm">
              You've explored all the properties of good money. Now you understand why some things work better as money than others!
            </p>
          </motion.div>
        )}
      </div>

      {/* Property Detail Modal */}
      <AnimatePresence>
        {selectedProperty && PROPERTY_EXPLANATIONS[selectedProperty] && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            
            <motion.div
              className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-md mx-auto border border-gray-600 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">
                  {PROPERTY_EXPLANATIONS[selectedProperty].icon}
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {PROPERTY_EXPLANATIONS[selectedProperty].title}
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-purple-300 mb-2">What it means:</h4>
                  <p className="text-gray-300">
                    {PROPERTY_EXPLANATIONS[selectedProperty].description}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-purple-300 mb-2">Example:</h4>
                  <p className="text-gray-300">
                    {PROPERTY_EXPLANATIONS[selectedProperty].example}
                  </p>
                </div>
              </div>
              
              <motion.button
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeModal}
              >
                Got it! 🎯
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
