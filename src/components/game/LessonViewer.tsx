import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Lightbulb,
  Star,
  Coins
} from 'lucide-react';
import type { Lesson, ContentSection, Question } from '../../types/game';
import { useGameStore } from '../../store/gameStore';
import { telegram } from '../../utils/telegram';
import { InteractiveSection } from './InteractiveSection';
import { MiniGame } from './MiniGame';

interface LessonViewerProps {
  lesson: Lesson;
  onComplete: () => void;
  onBack: () => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, onComplete, onBack }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const { completeLesson } = useGameStore();

  const sections = lesson.content.sections;
  const isLastSection = currentSection >= sections.length - 1;

  const handleNext = () => {
    if (isLastSection) {
      // First show mini-game if it exists and hasn't been shown
      if (lesson.miniGame && !showMiniGame) {
        setShowMiniGame(true);
      }
      // Then show quiz if it exists and hasn't been shown (and mini-game is done or doesn't exist)
      else if (lesson.quiz && !showQuiz) {
        setShowQuiz(true);
      }
      // Finally complete the lesson
      else {
        handleCompleteLesson();
      }
    } else {
      setCurrentSection(prev => prev + 1);
      telegram.hapticFeedback('light');
    }
  };

  const handlePrevious = () => {
    if (showQuiz) {
      setShowQuiz(false);
      // If there was a mini-game before the quiz, go back to it
      if (lesson.miniGame) {
        setShowMiniGame(true);
      }
    } else if (showMiniGame) {
      setShowMiniGame(false);
    } else if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      telegram.hapticFeedback('light');
    } else {
      onBack();
    }
  };

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    telegram.hapticFeedback('medium');
  };

  const handleMiniGameComplete = (success: boolean) => {
    if (success) {
      telegram.hapticFeedback('success');
      // Move to next step (quiz or completion)
      setShowMiniGame(false);
      if (lesson.quiz) {
        setShowQuiz(true);
      } else {
        handleCompleteLesson();
      }
    } else {
      telegram.hapticFeedback('error');
      // Allow retry - stay on mini-game
    }
  };

  const handleCompleteLesson = () => {
    completeLesson(lesson.id);
    setShowResults(true);
    telegram.hapticFeedback('success');
    
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  const renderSection = (section: ContentSection) => {
    switch (section.type) {
      case 'text':
        return (
          <div className="prose prose-invert max-w-none">
            <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
            <p className="text-gray-300 text-lg leading-relaxed">{section.content}</p>
          </div>
        );

      case 'metaphor':
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
            <div className="bg-gradient-to-br from-purple-900/50 to-blue-800/50 rounded-2xl p-6 border border-purple-500/30 mb-6">
              <div className="text-4xl mb-4">{section.metaphor?.visual}</div>
              <h4 className="text-xl font-semibold text-purple-300 mb-3">{section.metaphor?.title}</h4>
              <p className="text-gray-300 mb-4">{section.metaphor?.description}</p>
              <div className="bg-blue-900/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">Key Insight</span>
                </div>
                <p className="text-gray-200">{section.metaphor?.explanation}</p>
              </div>
            </div>
          </div>
        );

      case 'interactive':
        return (
          <InteractiveSection section={section} />
        );

      default:
        return (
          <div className="text-center text-gray-400">
            <p>Content type not supported yet</p>
          </div>
        );
    }
  };

  const renderQuiz = () => {
    if (!lesson.quiz) return null;

    const allAnswered = lesson.quiz.questions.every(q => q.id in quizAnswers);
    const correctAnswers = lesson.quiz.questions.filter(q => 
      quizAnswers[q.id] === q.correctAnswer
    ).length;

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white text-center mb-6">Knowledge Check</h3>
        
        {lesson.quiz.questions.map((question: Question, qIndex: number) => (
          <div key={question.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
            <h4 className="text-lg font-semibold text-white mb-4">
              {qIndex + 1}. {question.question}
            </h4>
            
            <div className="space-y-3">
              {question.options.map((option, optIndex) => {
                const isSelected = quizAnswers[question.id] === optIndex;
                const isCorrect = optIndex === question.correctAnswer;
                const showResult = question.id in quizAnswers;

                return (
                  <motion.button
                    key={optIndex}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      showResult
                        ? isCorrect
                          ? 'bg-green-900/30 border-green-500 text-green-300'
                          : isSelected
                          ? 'bg-red-900/30 border-red-500 text-red-300'
                          : 'bg-gray-700/30 border-gray-600 text-gray-300'
                        : isSelected
                        ? 'bg-purple-900/30 border-purple-500 text-white'
                        : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:border-purple-500/50'
                    }`}
                    whileHover={!showResult ? { scale: 1.02 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                    onClick={() => !showResult && handleQuizAnswer(question.id, optIndex)}
                    disabled={showResult}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && isCorrect && <CheckCircle className="w-5 h-5" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {question.id in quizAnswers && (
              <motion.div
                className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-semibold">Explanation</span>
                </div>
                <p className="text-gray-300 text-sm">{question.explanation}</p>
              </motion.div>
            )}
          </div>
        ))}

        {allAnswered && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-800/30 rounded-xl p-6 border border-green-500/30">
              <h4 className="text-xl font-bold text-white mb-2">Quiz Complete!</h4>
              <p className="text-gray-300 mb-4">
                You got {correctAnswers} out of {lesson.quiz.questions.length} questions correct!
              </p>
              <div className="flex justify-center">
                <motion.button
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCompleteLesson}
                >
                  Complete Lesson
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  if (showResults) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1 }}
        >
          🎉
        </motion.div>
        
        <h2 className="text-3xl font-bold text-white mb-4">Lesson Complete!</h2>
        <p className="text-gray-300 text-lg mb-6">Great job mastering this topic!</p>
        
        <div className="flex justify-center items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-yellow-400" />
            <span className="text-yellow-400 font-bold text-xl">+{lesson.reward.coins}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-blue-400" />
            <span className="text-blue-400 font-bold text-xl">+{lesson.reward.experience} XP</span>
          </div>
        </div>

        <motion.div
          className="text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Returning to course overview...
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
          <p className="text-gray-400">{lesson.description}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{lesson.estimatedTime} min</span>
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">{lesson.reward.coins}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progress</span>
          <span>
            {showMiniGame 
              ? 'Mini-Game' 
              : showQuiz 
                ? 'Quiz'
                : `${currentSection + 1} / ${sections.length}`
            }
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: showMiniGame || showQuiz 
                ? '100%' 
                : `${((currentSection + 1) / sections.length) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={showMiniGame ? 'minigame' : showQuiz ? 'quiz' : currentSection}
          className="min-h-[400px] mb-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {showMiniGame && lesson.miniGame
            ? <MiniGame miniGame={lesson.miniGame} onComplete={handleMiniGameComplete} />
            : showQuiz 
              ? renderQuiz() 
              : renderSection(sections[currentSection])
          }
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <motion.button
          className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>

        <motion.button
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
            showMiniGame 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
          }`}
          whileHover={showMiniGame ? {} : { scale: 1.05 }}
          whileTap={showMiniGame ? {} : { scale: 0.95 }}
          onClick={showMiniGame ? undefined : handleNext}
          disabled={showMiniGame}
        >
          <span>
            {showMiniGame
              ? 'Playing...'
              : showQuiz 
                ? 'Complete'
                : isLastSection 
                  ? (lesson.miniGame ? 'Start Mini-Game' : lesson.quiz ? 'Take Quiz' : 'Complete')
                  : 'Next'
            }
          </span>
          {!showQuiz && !showMiniGame && <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </div>
    </div>
  );
};
