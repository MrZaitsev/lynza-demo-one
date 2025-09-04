export interface User {
  id: string;
  name: string;
  level: number;
  coins: number;
  experience: number;
  completedLessons: string[];
  badges: Badge[];
  currentLesson?: string;
  unlockedLevels: number[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: Date;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  requiredLevel: number;
  lessons: Lesson[];
  reward: Reward;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  interactiveType?: 'block-builder' | 'security-checker' | 'investment-simulator' | 'interactive-exercise' | 'upsell';
  interactiveData?: Record<string, unknown>;
  reward: Reward;
  isUnlocked: boolean;
  isCompleted: boolean;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: LessonContent;
  quiz?: Quiz;
  miniGame?: MiniGame;
  reward: Reward;
  estimatedTime: number; // in minutes
  isCompleted: boolean;
  isUnlocked: boolean;
}

export interface LessonContent {
  type: 'text' | 'interactive' | 'video' | 'simulation';
  sections: ContentSection[];
}

export interface ContentSection {
  id: string;
  type: 'text' | 'image' | 'interactive' | 'metaphor';
  title?: string;
  content: string;
  interactive?: InteractiveElement;
  metaphor?: Metaphor;
}

export interface InteractiveElement {
  type: 'drag-drop' | 'click-sequence' | 'choice' | 'simulation';
  data: any;
}

export interface Metaphor {
  title: string;
  description: string;
  visual: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface MiniGame {
  id: string;
  type: 'block-builder' | 'security-checker' | 'investment-simulator' | 'wallet-manager';
  title: string;
  description: string;
  data: any;
}

export interface Reward {
  coins: number;
  experience: number;
  badges?: string[]; // Badge IDs
  items?: Item[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'skin' | 'collectible' | 'power-up';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (user: User) => boolean;
  reward: Reward;
}
