import React from 'react';
import { VideoLessonViewer } from '../components/game/VideoLessonViewer';
import type { VideoLesson } from '../types/game';
import { useGameStore } from '../store/gameStore';

interface VideoLessonPageProps {
  lesson: VideoLesson;
  onBack: () => void;
}

export const VideoLessonPage: React.FC<VideoLessonPageProps> = ({ lesson, onBack }) => {
  const { completeVideoLesson } = useGameStore();

  const handleComplete = (success: boolean) => {
    if (success) {
      completeVideoLesson(lesson.id);
    }
    // Always go back after completion or failure
    onBack();
  };

  return (
    <VideoLessonViewer
      lesson={lesson}
      onComplete={handleComplete}
      onBack={onBack}
    />
  );
};
