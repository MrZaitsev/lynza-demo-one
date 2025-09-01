import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { LevelPage } from './pages/LevelPage';
import { LessonPage } from './pages/LessonPage';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { telegram } from './utils/telegram';

type Page = 'home' | 'level' | 'lesson';

interface AppState {
  currentPage: Page;
  selectedLevelId?: number;
  selectedLessonId?: string;
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

  const navigateToLevel = (levelId: number) => {
    setAppState({
      currentPage: 'level',
      selectedLevelId: levelId
    });
  };

  const navigateToLesson = (lessonId: string) => {
    setAppState({
      ...appState,
      currentPage: 'lesson',
      selectedLessonId: lessonId
    });
  };

  const navigateToHome = () => {
    setAppState({
      currentPage: 'home'
    });
  };

  const navigateBack = () => {
    if (appState.currentPage === 'lesson') {
      setAppState({
        currentPage: 'level',
        selectedLevelId: appState.selectedLevelId
      });
    } else if (appState.currentPage === 'level') {
      navigateToHome();
    }
  };

  const handleLessonComplete = () => {
    // After lesson completion, go back to level page
    setAppState({
      currentPage: 'level',
      selectedLevelId: appState.selectedLevelId
    });
  };

  const renderCurrentPage = () => {
    switch (appState.currentPage) {
      case 'home':
        return <Home onLevelSelect={navigateToLevel} />;
      
      case 'level':
        if (!appState.selectedLevelId) {
          return <Home onLevelSelect={navigateToLevel} />;
        }
        return (
          <LevelPage
            levelId={appState.selectedLevelId}
            onBack={navigateBack}
            onLessonSelect={navigateToLesson}
          />
        );
      
      case 'lesson':
        if (!appState.selectedLessonId) {
          return <Home onLevelSelect={navigateToLevel} />;
        }
        return (
          <LessonPage
            lessonId={appState.selectedLessonId}
            onBack={navigateBack}
            onComplete={handleLessonComplete}
          />
        );
      
      default:
        return <Home onLevelSelect={navigateToLevel} />;
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