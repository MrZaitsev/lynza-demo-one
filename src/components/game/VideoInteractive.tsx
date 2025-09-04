import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, Sparkles, ArrowLeft } from 'lucide-react';
import { telegram } from '../../utils/telegram';

interface Property {
  id: string;
  name: string;
  icon: string;
  explanation: string;
  examples: string[];
}

interface VideoInteractiveProps {
  data: Record<string, unknown>;
  onComplete: (success: boolean) => void;
  onBack?: () => void;
}

export const VideoInteractive: React.FC<VideoInteractiveProps> = ({ 
  data, 
  onComplete, 
  onBack 
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [exploredProperties, setExploredProperties] = useState<Set<string>>(new Set());

  // Extract properties from the data
  const properties = (data?.properties as Property[]) || [];
  const title = (data?.title as string) || 'Interactive Exercise';

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setExploredProperties(prev => new Set([...prev, property.id]));
    telegram.hapticFeedback('medium');
  };

  const closeModal = () => {
    setSelectedProperty(null);
    telegram.hapticFeedback('light');
  };

  const handleComplete = () => {
    onComplete(true); // Always return true since user completed the interactive
    telegram.hapticFeedback('success');
  };

  const allExplored = properties.length > 0 && properties.every((prop) => exploredProperties.has(prop.id));

  if (properties.length === 0) {
    return (
      <div className="glass-card p-6">
        {onBack && (
          <motion.button
            onClick={onBack}
            className="mb-4 flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>
        )}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
          <p className="text-gray-400">Interactive content not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      {/* Back Button */}
      {onBack && (
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Video</span>
        </motion.button>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h2 className="text-3xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-gray-300">
          💡 Tap the properties to learn what makes good money!
        </p>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {properties.map((property) => {
          const isExplored = exploredProperties.has(property.id);
          
          return (
            <motion.div
              key={property.id}
              className={`relative border rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                isExplored
                  ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                  : 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 hover:border-purple-400/50'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePropertyClick(property)}
            >
              {isExplored && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className="text-4xl mb-3">
                {property.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{property.name}</h3>
              
              {!isExplored && (
                <motion.div
                  className="flex items-center justify-center gap-1 text-purple-300 text-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Info className="w-4 h-4" />
                  <span>Tap to explore</span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-white/60">
          Progress: {exploredProperties.size}/{properties.length} explored
        </div>
        <div className="w-32 bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(exploredProperties.size / properties.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {/* Completion Message */}
      {allExplored && (
        <motion.div
          className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl"
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

      {/* Complete Button */}
      {allExplored && (
        <motion.button
          onClick={handleComplete}
          className="w-full btn-primary text-lg py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Complete Interactive ✨</span>
        </motion.button>
      )}

      {/* Property Detail Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            
            <motion.div
              className="relative glass-card max-w-md mx-auto shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">
                  {selectedProperty.icon}
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {selectedProperty.name}
                </h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold text-purple-300 mb-2">What it means:</h4>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedProperty.explanation}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-purple-300 mb-2">Examples:</h4>
                  <ul className="text-gray-300 space-y-1">
                    {selectedProperty.examples.map((example, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <motion.button
                className="w-full btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
