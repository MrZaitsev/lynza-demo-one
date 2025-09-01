import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { telegram } from '../utils/telegram';
import { LessonViewer } from '../components/game/LessonViewer';

interface LessonPageProps {
  lessonId: string;
  onBack: () => void;
  onComplete: () => void;
}

export const LessonPage: React.FC<LessonPageProps> = ({ lessonId, onBack, onComplete }) => {
  const { levels } = useGameStore();
  
  // Find the lesson across all levels
  let lesson = null;
  for (const level of levels) {
    const foundLesson = level.lessons.find(l => l.id === lessonId);
    if (foundLesson) {
      lesson = foundLesson;
      break;
    }
  }

  useEffect(() => {
    // Set up Telegram back button
    telegram.setBackButton(onBack);
    
    return () => {
      telegram.hideBackButton();
    };
  }, [onBack]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Lesson Not Found</h2>
          <button
            onClick={onBack}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-6">
        <LessonViewer
          lesson={lesson}
          onComplete={onComplete}
          onBack={onBack}
        />
      </div>
    </div>
  );
};
