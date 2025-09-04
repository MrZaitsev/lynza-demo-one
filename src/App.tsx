import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { VideoLessonPage } from './pages/VideoLessonPage';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { telegram } from './utils/telegram';
import type { VideoLesson } from './types/game';

type Page = 'home' | 'video-lesson';

interface AppState {
  currentPage: Page;
  selectedLesson?: VideoLesson;
}

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'home'
  });

  useEffect(() => {
    // Initialize Telegram Web App
    if (telegram.isTelegramEnvironment()) {
      console.log('Running in Telegram environment');
    } else {
      console.log('Running in development mode');
    }
  }, []);

  const navigateToLesson = (lesson: VideoLesson) => {
    setAppState({
      currentPage: 'video-lesson',
      selectedLesson: lesson
    });
  };

  const navigateToHome = () => {
    setAppState({
      currentPage: 'home'
    });
  };

  const renderCurrentPage = () => {
    switch (appState.currentPage) {
      case 'home':
        return <Home onStartLesson={navigateToLesson} />;
      
      case 'video-lesson':
        if (!appState.selectedLesson) {
          return <Home onStartLesson={navigateToLesson} />;
        }
        return (
          <VideoLessonPage
            lesson={appState.selectedLesson}
            onBack={navigateToHome}
          />
        );
      
      default:
        return <Home onStartLesson={navigateToLesson} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="App min-h-screen relative overflow-hidden">
        {/* Modern Background with Animated Elements */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {renderCurrentPage()}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;