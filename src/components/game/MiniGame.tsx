import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  X, 
  RotateCcw, 
  Shield, 
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Hash,
  Clock,
  Users,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { telegram } from '../../utils/telegram';

interface MiniGameProps {
  type: 'block-builder' | 'security-checker' | 'investment-simulator' | 'wallet-manager';
  data: Record<string, unknown> | undefined;
  onComplete: (success: boolean) => void;
  onBack?: () => void;
}

interface Transaction {
  from: string;
  to: string;
  amount: number;
  id?: string;
}

interface Block {
  transactions: Transaction[];
  timestamp: number;
  previousHash: string;
  hash: string;
  nonce: number;
}

export const MiniGame: React.FC<MiniGameProps> = ({ type, data, onComplete, onBack }) => {
  const [gameState, setGameState] = useState<'playing' | 'completed' | 'failed'>('playing');
  const [score, setScore] = useState(0);

  const renderBlockBuilder = () => {
    const [selectedTransactions, setSelectedTransactions] = useState<Transaction[]>([]);
    const [availableTransactions, setAvailableTransactions] = useState<Transaction[]>(
      (data?.transactions as Transaction[])?.map((t: Transaction, i: number) => ({ ...t, id: `tx-${i}` })) || []
    );
    const [currentBlock, setCurrentBlock] = useState<Partial<Block>>({
      transactions: [],
      timestamp: Date.now(),
      previousHash: '000abc123def456...',
      hash: '',
      nonce: 0
    });
    const [isValidating, setIsValidating] = useState(false);

    const handleTransactionSelect = (transaction: Transaction) => {
      const newSelected = [...selectedTransactions, transaction];
      const newAvailable = availableTransactions.filter(t => t.id !== transaction.id);
      
      setSelectedTransactions(newSelected);
      setAvailableTransactions(newAvailable);
      
      // Update block
      const updatedBlock = {
        ...currentBlock,
        transactions: newSelected,
        hash: generateMockHash(newSelected)
      };
      setCurrentBlock(updatedBlock);
      
      telegram.hapticFeedback('light');

      // If all transactions are added, validate the block
      if (newSelected.length === ((data?.transactions as Transaction[])?.length || 0)) {
        setIsValidating(true);
        setTimeout(() => {
          setGameState('completed');
          setScore(100);
          telegram.hapticFeedback('success');
        }, 1500);
      }
    };

    const handleRemoveTransaction = (transaction: Transaction) => {
      const newSelected = selectedTransactions.filter(t => t.id !== transaction.id);
      const newAvailable = [...availableTransactions, transaction];
      
      setSelectedTransactions(newSelected);
      setAvailableTransactions(newAvailable);
      
      const updatedBlock = {
        ...currentBlock,
        transactions: newSelected,
        hash: generateMockHash(newSelected)
      };
      setCurrentBlock(updatedBlock);
      
      telegram.hapticFeedback('light');
    };

    const generateMockHash = (transactions: Transaction[]) => {
      if (transactions.length === 0) return '';
      const base = transactions.reduce((acc, t) => acc + t.amount, 0);
      return `00${base.toString(16).padStart(6, '0')}...`;
    };

    const handleReset = () => {
      setSelectedTransactions([]);
      setAvailableTransactions((data?.transactions as Transaction[])?.map((t: Transaction, i: number) => ({ ...t, id: `tx-${i}` })) || []);
      setCurrentBlock({
        transactions: [],
        timestamp: Date.now(),
        previousHash: '000abc123def456...',
        hash: '',
        nonce: 0
      });
      setGameState('playing');
      setScore(0);
      setIsValidating(false);
    };

    return (
      <div className="space-y-6">
        {/* Back Button */}
        {onBack && (
          <motion.button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Video</span>
          </motion.button>
        )}

        <div className="text-center">
          <div className="text-4xl mb-3">🧱</div>
          <h3 className="text-2xl font-bold text-white mb-2">Build Your First Block</h3>
          <p className="text-gray-300">Drag transactions into the correct order to build a valid block</p>
        </div>

        {/* Block Visualization */}
        <motion.div 
          className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 transition-all duration-500 ${
            isValidating 
              ? 'border-yellow-400 shadow-yellow-400/20 shadow-lg'
              : gameState === 'completed'
                ? 'border-green-400 shadow-green-400/20 shadow-lg'
                : 'border-purple-500/30'
          }`}
          animate={isValidating ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5, repeat: isValidating ? Infinity : 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Hash className="w-5 h-5 text-purple-400" />
              Block #{Math.floor(Math.random() * 1000000)}
            </h4>
            {gameState === 'completed' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 text-green-400"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Valid Block!</span>
              </motion.div>
            )}
            {isValidating && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-yellow-400"
              >
                <Hash className="w-5 h-5" />
              </motion.div>
            )}
          </div>

          {/* Block Header */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-gray-400 mb-1">Previous Hash</div>
              <div className="text-purple-300 font-mono text-xs">{currentBlock.previousHash}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-gray-400 mb-1">Current Hash</div>
              <div className="text-cyan-300 font-mono text-xs">
                {currentBlock.hash || 'Calculating...'}
              </div>
            </div>
          </div>

          {/* Transactions in Block */}
          <div className="space-y-2 min-h-[120px]">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">
                Transactions ({selectedTransactions.length}/{((data?.transactions as Transaction[])?.length || 0)})
              </span>
            </div>
            
            {selectedTransactions.length === 0 ? (
              <div className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
                <div className="text-3xl mb-2">⬇️</div>
                <p>Drag transactions here to build your block</p>
              </div>
            ) : (
              <AnimatePresence>
                {selectedTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50 rounded-lg p-4 cursor-pointer hover:border-purple-400/70 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => gameState === 'playing' && handleRemoveTransaction(transaction)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">💰</div>
                        <div>
                          <div className="text-white font-medium">
                            {transaction.from} → {transaction.to}
                          </div>
                          <div className="text-purple-300 text-sm">
                            Amount: {transaction.amount} coins
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-400 text-xs">
                        TX #{index + 1}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* Available Transactions Pool */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Transaction Pool
          </h4>
          
          <div className="grid gap-3">
            <AnimatePresence>
              {availableTransactions.map((transaction) => (
                <motion.button
                  key={transaction.id}
                  className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/50 rounded-lg p-4 text-left hover:border-blue-400/70 transition-all duration-200"
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTransactionSelect(transaction)}
                  disabled={gameState !== 'playing'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📤</div>
                      <div>
                        <div className="text-white font-medium">
                          {transaction.from} → {transaction.to}
                        </div>
                        <div className="text-blue-300 text-sm">
                          {transaction.amount} coins
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      Click to add →
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {availableTransactions.length === 0 && gameState === 'playing' && (
            <div className="text-center py-6 text-gray-500">
              <div className="text-3xl mb-2">✅</div>
              <p>All transactions added to block!</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {gameState === 'playing' && (
            <motion.button
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Block</span>
            </motion.button>
          )}
          
          {gameState === 'completed' && (
            <motion.button
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onComplete(true)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <CheckCircle className="w-5 h-5" />
              <span>Complete Mini-Game</span>
            </motion.button>
          )}
        </div>

        {/* Educational Tip */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h5 className="text-blue-300 font-semibold mb-1">Did you know?</h5>
              <p className="text-blue-200 text-sm">
                In a real blockchain, transactions are validated and grouped into blocks. Each block contains a hash of the previous block, creating an unbreakable chain of records!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSecurityChecker = () => {
    const [currentScenario, setCurrentScenario] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [showExplanation, setShowExplanation] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const scenarios = (data?.scenarios as Array<{ 
      id: string; 
      question: string; 
      options: Array<{ text: string; isCorrect: boolean }>; 
      explanation: string;
    }>) || [];

    const handleAnswer = (answerIndex: number) => {
      const newAnswers = [...answers, answerIndex];
      setAnswers(newAnswers);
      setShowExplanation(true);
      telegram.hapticFeedback('medium');
    };

    const handleNext = () => {
      setShowExplanation(false);
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(currentScenario + 1);
        setTimeLeft(30);
      } else {
        // Calculate final score
        const correctAnswers = answers.filter((answer, index) => 
          scenarios[index] && scenarios[index].options[answer]?.isCorrect
        ).length;
        const finalScore = Math.round((correctAnswers / scenarios.length) * 100);
        setScore(finalScore);
        setGameState(finalScore >= 70 ? 'completed' : 'failed');
        telegram.hapticFeedback(finalScore >= 70 ? 'success' : 'error');
      }
    };

    useEffect(() => {
      if (gameState === 'playing' && !showExplanation && timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else if (timeLeft === 0 && !showExplanation && gameState === 'playing') {
        // Time's up - mark as wrong answer
        handleAnswer(-1);
      }
    }, [timeLeft, showExplanation, gameState, currentScenario, answers, scenarios]);

    if (gameState === 'completed' || gameState === 'failed') {
      return (
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-8xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            {gameState === 'completed' ? '🛡️' : '⚠️'}
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {gameState === 'completed' ? 'Security Expert!' : 'Keep Learning!'}
          </h3>
          <p className="text-gray-300 mb-4">
            You scored {score}% on security scenarios
          </p>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
              gameState === 'completed' 
                ? 'bg-green-900/30 border border-green-500/50 text-green-300'
                : 'bg-red-900/30 border border-red-500/50 text-red-300'
            }`}>
              {gameState === 'completed' ? <Shield className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              <span className="font-semibold">
                {gameState === 'completed' ? 'Crypto Security Pro' : 'Security Trainee'}
              </span>
            </div>
            
            <motion.button
              className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-colors ${
                gameState === 'completed'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onComplete(true)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <CheckCircle className="w-5 h-5" />
              <span>
                {gameState === 'completed' ? 'Complete Security Challenge' : 'Continue Learning'}
              </span>
            </motion.button>
        </motion.div>
      );
    }

    const scenario = scenarios[currentScenario];
    const hasAnswered = currentScenario < answers.length;

    return (
      <div className="space-y-6">
        {/* Back Button */}
        {onBack && (
          <motion.button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Video</span>
          </motion.button>
        )}

        <div className="text-center">
          <div className="text-4xl mb-3">🛡️</div>
          <h3 className="text-2xl font-bold text-white mb-2">Security Challenge</h3>
          <p className="text-gray-300 mb-4">Navigate through various security scenarios and make the right choices</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span>Scenario {currentScenario + 1} of {scenarios.length}</span>
            <div className={`flex items-center gap-2 ${timeLeft <= 10 ? 'text-red-400' : 'text-blue-400'}`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono">{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Timer Bar */}
        <div className="w-full bg-gray-700 rounded-full h-1">
          <motion.div
            className={`h-1 rounded-full transition-colors ${
              timeLeft <= 10 ? 'bg-red-500' : 'bg-green-500'
            }`}
            animate={{ width: `${(timeLeft / 30) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <motion.div 
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-600"
          key={currentScenario}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-3 mb-6">
            <div className="text-3xl">🎯</div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">
                Security Scenario
              </h4>
              <p className="text-gray-300 leading-relaxed">
                {scenario.question}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {scenario.options.map((option, index: number) => {
              const isSelected = hasAnswered && answers[currentScenario] === index;
              const isCorrect = option.isCorrect;
              const showResult = showExplanation;

              return (
                <motion.button
                  key={index}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                    showResult
                      ? isCorrect
                        ? 'bg-green-900/30 border-green-500 text-green-300'
                        : isSelected
                        ? 'bg-red-900/30 border-red-500 text-red-300'
                        : 'bg-gray-700/30 border-gray-600 text-gray-300'
                      : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:border-purple-500/70 hover:bg-purple-900/20'
                  }`}
                  whileHover={!showResult ? { scale: 1.02, x: 5 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult || timeLeft === 0}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        showResult && isCorrect 
                          ? 'border-green-500 bg-green-500' 
                          : showResult && isSelected 
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-400'
                      }`}>
                        {showResult && (isCorrect || isSelected) && (
                          <div className="text-white text-xs">
                            {isCorrect ? '✓' : '✗'}
                          </div>
                        )}
                      </div>
                      <span className="font-medium">{option.text}</span>
                    </div>
                    {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {showResult && isSelected && !isCorrect && <X className="w-5 h-5 text-red-400" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <motion.div
              className="mt-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📚</div>
                  <div>
                    <h5 className="text-blue-300 font-semibold mb-2">Explanation</h5>
                    <p className="text-blue-200 text-sm">
                      {scenario.explanation || `The correct answer is "${scenario.options.find(opt => opt.isCorrect)?.text}" because it follows security best practices.`}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Next Button */}
              <div className="flex justify-center">
                <motion.button
                  onClick={handleNext}
                  className="btn-primary flex items-center space-x-2 px-6 py-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span>{currentScenario < scenarios.length - 1 ? 'Next Question' : 'See Results'}</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  };

  const renderInvestmentSimulator = () => {
    const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
    const [investment, setInvestment] = useState(100);
    const [timeframe, setTimeframe] = useState(12); // months
    const [isSimulating, setIsSimulating] = useState(false);
    const [results, setResults] = useState<any>(null);
    const strategies = (data?.strategies || []) as Array<{ id: string; name: string; description: string; riskLevel: string; expectedReturn: number; timeframe: string; pros: string[]; cons: string[]; }>;

    const simulateInvestment = () => {
      if (!selectedStrategy) return;
      
      setIsSimulating(true);
      telegram.hapticFeedback('medium');
      
      setTimeout(() => {
        const strategy = strategies.find((s: any) => s.name === selectedStrategy);
        if (!strategy) {
          setIsSimulating(false);
          return;
        }
        
        const baseReturn = strategy.expectedReturn / 100;
        // Add some randomness (±3% from expected return)
        const randomVariation = (Math.random() - 0.5) * 0.06; // ±3%
        const actualReturn = baseReturn + randomVariation;
        const finalAmount = investment * (1 + actualReturn);
        const profit = finalAmount - investment;
        const profitPercentage = (profit / investment) * 100;
        
        setResults({
          strategy: strategy.name,
          initialAmount: investment,
          finalAmount: Math.round(finalAmount * 100) / 100,
          profit: Math.round(profit * 100) / 100,
          profitPercentage: Math.round(profitPercentage * 100) / 100,
          risk: strategy.riskLevel,
          timeframe
        });
        
        setIsSimulating(false);
        setGameState('completed');
        setScore(profitPercentage > 0 ? 100 : 50);
        telegram.hapticFeedback('success');
      }, 2000);
    };

    const resetSimulation = () => {
      setSelectedStrategy(null);
      setInvestment(100);
      setTimeframe(12);
      setIsSimulating(false);
      setResults(null);
      setGameState('playing');
      setScore(0);
    };

    if (results) {
      return (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-2xl font-bold text-white mb-2">Investment Results</h3>
            <p className="text-gray-300">Here's how your investment performed</p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-600">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold text-white">${results.finalAmount}</div>
                <div className="text-gray-400">Final Amount</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">
                  {results.profit >= 0 ? '📈' : '📉'}
                </div>
                <div className={`text-2xl font-bold ${results.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {results.profit >= 0 ? '+' : ''}${results.profit}
                </div>
                <div className="text-gray-400">Profit/Loss</div>
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Strategy:</span>
                <span className="text-white font-semibold">{results.strategy}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Return:</span>
                <span className={`font-semibold ${results.profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {results.profitPercentage >= 0 ? '+' : ''}{results.profitPercentage}%
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Risk Level:</span>
                <span className={`font-semibold capitalize ${
                  results.risk === 'low' ? 'text-green-400' :
                  results.risk === 'medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {results.risk}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Timeframe:</span>
                <span className="text-white font-semibold">{results.timeframe} months</span>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h5 className="text-blue-300 font-semibold mb-1">Investment Insight</h5>
                  <p className="text-blue-200 text-sm">
                    {results.profit >= 0 
                      ? `Great choice! Your ${results.strategy.toLowerCase()} strategy paid off with a ${results.profitPercentage}% return.`
                      : `This time your investment didn't perform well, but that's normal in investing. Diversification and long-term thinking are key!`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <motion.button
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onComplete(true)}
            >
              <CheckCircle className="w-5 h-5" />
              <span>Complete Investment Simulation</span>
            </motion.button>
            
            <motion.button
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetSimulation}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Another Strategy</span>
            </motion.button>
          </div>
        </motion.div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Back Button */}
        {onBack && (
          <motion.button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Video</span>
          </motion.button>
        )}

        <div className="text-center">
          <div className="text-4xl mb-3">💼</div>
          <h3 className="text-2xl font-bold text-white mb-2">Investment Simulator</h3>
          <p className="text-gray-300">Simulate investing $100 in DeFi vs holding Bitcoin</p>
        </div>

        {/* Investment Amount */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Investment Amount
          </h4>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={investment}
              onChange={(e) => setInvestment(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-2xl font-bold text-green-400 min-w-[80px]">
              ${investment}
            </div>
          </div>
        </div>

        {/* Timeframe */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Investment Period
          </h4>
          <div className="flex gap-2">
            {[6, 12, 24, 36].map((months) => (
              <motion.button
                key={months}
                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                  timeframe === months
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-blue-500/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeframe(months)}
              >
                {months} months
              </motion.button>
            ))}
          </div>
        </div>

        {/* Investment Strategies */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Choose Your Strategy
          </h4>
          
          <div className="grid gap-4">
            {strategies.map((strategy: any, index: number) => (
              <motion.button
                key={strategy.name}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedStrategy === strategy.name
                    ? 'bg-purple-900/30 border-purple-500 text-white'
                    : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:border-purple-500/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedStrategy(strategy.name)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-lg">{strategy.name}</h5>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    strategy.riskLevel.toLowerCase() === 'low' 
                      ? 'bg-green-900/30 border border-green-500/50 text-green-300'
                      : strategy.riskLevel.toLowerCase() === 'medium'
                        ? 'bg-yellow-900/30 border border-yellow-500/50 text-yellow-300'
                        : 'bg-red-900/30 border border-red-500/50 text-red-300'
                  }`}>
                    {strategy.riskLevel.toUpperCase()} RISK
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-3">{strategy.description}</p>
                
                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Expected: {strategy.expectedReturn}%</span>
                  </div>
                </div>
                
                <AnimatePresence>
                  {selectedStrategy === strategy.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-600 pt-3 mt-3 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="text-green-400 font-semibold mb-1">✓ Pros</div>
                          <ul className="space-y-1">
                            {(strategy.pros || []).map((pro: string, i: number) => (
                              <li key={i} className="text-green-300">• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-red-400 font-semibold mb-1">✗ Cons</div>
                          <ul className="space-y-1">
                            {(strategy.cons || []).map((con: string, i: number) => (
                              <li key={i} className="text-red-300">• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Simulate Button */}
        <div className="flex justify-center">
          <motion.button
            className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all ${
              selectedStrategy && !isSimulating
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={selectedStrategy && !isSimulating ? { scale: 1.05 } : {}}
            whileTap={selectedStrategy && !isSimulating ? { scale: 0.95 } : {}}
            onClick={simulateInvestment}
            disabled={!selectedStrategy || isSimulating}
          >
            {isSimulating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Hash className="w-5 h-5" />
                </motion.div>
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                <span>Start Simulation</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    );
  };

  const renderGame = () => {
    switch (type) {
      case 'block-builder':
        return renderBlockBuilder();
      case 'security-checker':
        return renderSecurityChecker();
      case 'investment-simulator':
        return renderInvestmentSimulator();
      case 'wallet-manager':
        return renderSecurityChecker(); // Use security checker for wallet manager
      default:
        return (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
            <p className="text-gray-400">This mini-game is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${type}-${gameState}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderGame()}
        </motion.div>
      </AnimatePresence>


    </div>
  );
};