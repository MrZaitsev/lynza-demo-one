import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Level, Badge, Achievement, VideoLesson } from '../types/game';
import { levels, badges, achievements, videoLessons } from '../data/gameData';

interface GameState {
  user: User;
  levels: Level[];
  videoLessons: VideoLesson[];
  availableBadges: Badge[];
  achievements: Achievement[];
  currentVideoLesson: VideoLesson | null;
  
  // Actions
  initializeUser: (telegramUser: { id?: number; first_name?: string } | null) => void;
  completeLesson: (lessonId: string) => void;
  completeVideoLesson: (lessonId: string) => void;
  unlockLevel: (levelId: number) => void;
  unlockNextVideoLesson: () => void;
  awardBadge: (badgeId: string) => void;
  addCoins: (amount: number) => void;
  addExperience: (amount: number) => void;
  checkAchievements: () => void;
  resetProgress: () => void;
  getCurrentVideoLesson: () => VideoLesson | null;
  getNextVideoLesson: () => VideoLesson | null;
}

const initialUser: User = {
  id: '',
  name: '',
  level: 1,
  coins: 0,
  experience: 0,
  completedLessons: [],
  badges: [],
  unlockedLevels: [1]
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      user: initialUser,
      levels: levels.map((level, index) => ({
        ...level,
        isUnlocked: index === 0,
        lessons: level.lessons.map((lesson, lessonIndex) => ({
          ...lesson,
          isUnlocked: index === 0 && lessonIndex === 0
        }))
      })),
      videoLessons: videoLessons.map((lesson, index) => ({
        ...lesson,
        isUnlocked: index === 0,
        isCompleted: false
      })),
      availableBadges: badges,
      achievements: achievements,
      currentVideoLesson: null,

      initializeUser: (telegramUser) => {
        const currentState = get();
        console.log('Initializing user, current user:', currentState.user);
        console.log('Telegram user:', telegramUser);
        
        if (!currentState.user.id || !currentState.user.name) {
          const newUser = {
            ...initialUser,
            id: telegramUser?.id?.toString() || 'demo-user',
            name: telegramUser?.first_name || 'Crypto Explorer'
          };
          console.log('Setting new user:', newUser);
          set({
            user: newUser
          });
        }
      },

      completeLesson: (lessonId: string) => {
        const state = get();
        const user = state.user;
        
        if (user.completedLessons.includes(lessonId)) {
          return; // Already completed
        }

        // Find the lesson and its rewards
        let lessonReward: any = null;
        let nextLessonId: string | null = null;
        let levelCompleted = false;
        let levelReward: any = null;

        const updatedLevels = state.levels.map(level => {
          const updatedLessons = level.lessons.map((lesson, index) => {
            if (lesson.id === lessonId) {
              lessonReward = lesson.reward;
              // Unlock next lesson in the same level
              if (index < level.lessons.length - 1) {
                nextLessonId = level.lessons[index + 1].id;
              }
              return { ...lesson, isCompleted: true };
            }
            if (lesson.id === nextLessonId) {
              return { ...lesson, isUnlocked: true };
            }
            return lesson;
          });

          // Check if level is completed
          const allLessonsCompleted = updatedLessons.every(lesson => lesson.isCompleted);
          if (allLessonsCompleted && !level.isCompleted) {
            levelCompleted = true;
            levelReward = level.reward;
            return { ...level, lessons: updatedLessons, isCompleted: true };
          }

          return { ...level, lessons: updatedLessons };
        });

        // Calculate new stats
        let newCoins = user.coins;
        let newExperience = user.experience;
        const newBadges = [...user.badges];
        let newLevel = user.level;

        if (lessonReward) {
          newCoins += lessonReward.coins;
          newExperience += lessonReward.experience;
        }

        if (levelCompleted && levelReward) {
          newCoins += levelReward.coins;
          newExperience += levelReward.experience;
          
          if (levelReward.badges) {
            levelReward.badges.forEach((badge: any) => {
              if (!newBadges.find(b => b.id === badge.id)) {
                newBadges.push({ ...badge, earnedAt: new Date() });
              }
            });
          }

          // Unlock next level
          const currentLevelIndex = updatedLevels.findIndex(l => l.isCompleted && l.id === user.level + 1);
          if (currentLevelIndex === -1) {
            const nextLevel = updatedLevels.find(l => l.id === user.level + 1);
            if (nextLevel) {
              nextLevel.isUnlocked = true;
              if (nextLevel.lessons.length > 0) {
                nextLevel.lessons[0].isUnlocked = true;
              }
              newLevel = user.level + 1;
            }
          }
        }

        set({
          user: {
            ...user,
            level: newLevel,
            coins: newCoins,
            experience: newExperience,
            completedLessons: [...user.completedLessons, lessonId],
            badges: newBadges,
            unlockedLevels: levelCompleted ? [...user.unlockedLevels, newLevel] : user.unlockedLevels
          },
          levels: updatedLevels
        });

        // Check for achievements
        get().checkAchievements();
      },

      unlockLevel: (levelId: number) => {
        const state = get();
        const updatedLevels = state.levels.map(level => {
          if (level.id === levelId) {
            const updatedLevel = { ...level, isUnlocked: true };
            if (updatedLevel.lessons.length > 0) {
              updatedLevel.lessons[0].isUnlocked = true;
            }
            return updatedLevel;
          }
          return level;
        });

        set({
          levels: updatedLevels,
          user: {
            ...state.user,
            unlockedLevels: [...state.user.unlockedLevels, levelId]
          }
        });
      },

      awardBadge: (badgeId: string) => {
        const state = get();
        const badge = state.availableBadges.find(b => b.id === badgeId);
        
        if (badge && !state.user.badges.find(b => b.id === badgeId)) {
          set({
            user: {
              ...state.user,
              badges: [...state.user.badges, { ...badge, earnedAt: new Date() }]
            }
          });
        }
      },

      addCoins: (amount: number) => {
        const state = get();
        set({
          user: {
            ...state.user,
            coins: state.user.coins + amount
          }
        });
      },

      addExperience: (amount: number) => {
        const state = get();
        set({
          user: {
            ...state.user,
            experience: state.user.experience + amount
          }
        });
      },

      checkAchievements: () => {
        const state = get();
        state.achievements.forEach(achievement => {
          if (achievement.condition(state.user)) {
            // Award achievement (this would need more sophisticated tracking)
            console.log(`Achievement unlocked: ${achievement.name}`);
          }
        });
      },

      completeVideoLesson: (lessonId: string) => {
        const state = get();
        const lesson = state.videoLessons.find(l => l.id === lessonId);
        
        if (!lesson || lesson.isCompleted) {
          return; // Lesson not found or already completed
        }

        // Update lesson as completed
        const updatedVideoLessons = state.videoLessons.map(l => 
          l.id === lessonId ? { ...l, isCompleted: true } : l
        );

        // Apply rewards
        let newCoins = state.user.coins;
        let newExperience = state.user.experience;
        const newBadges = [...state.user.badges];

        if (lesson.reward) {
          newCoins += lesson.reward.coins || 0;
          newExperience += lesson.reward.experience || 0;
          
          if (lesson.reward.badges) {
            lesson.reward.badges.forEach((badgeId: string) => {
              const badge = state.availableBadges.find(b => b.id === badgeId);
              if (badge && !newBadges.find(b => b.id === badgeId)) {
                newBadges.push({ ...badge, earnedAt: new Date() });
              }
            });
          }
        }

        set({
          videoLessons: updatedVideoLessons,
          user: {
            ...state.user,
            coins: newCoins,
            experience: newExperience,
            badges: newBadges,
            completedLessons: [...state.user.completedLessons, lessonId]
          }
        });

        // Unlock next lesson
        get().unlockNextVideoLesson();
      },

      unlockNextVideoLesson: () => {
        const state = get();
        const currentLessonIndex = state.videoLessons.findIndex(l => l.isCompleted);
        const nextLessonIndex = currentLessonIndex + 1;
        
        if (nextLessonIndex < state.videoLessons.length) {
          const updatedVideoLessons = state.videoLessons.map((lesson, index) => 
            index === nextLessonIndex ? { ...lesson, isUnlocked: true } : lesson
          );
          
          set({ videoLessons: updatedVideoLessons });
        }
      },

      getCurrentVideoLesson: () => {
        const state = get();
        return state.videoLessons.find(l => l.isUnlocked && !l.isCompleted) || null;
      },

      getNextVideoLesson: () => {
        const state = get();
        const completedCount = state.videoLessons.filter(l => l.isCompleted).length;
        return state.videoLessons[completedCount] || null;
      },

      resetProgress: () => {
        set({
          user: { ...initialUser, id: get().user.id, name: get().user.name },
          levels: levels.map((level, index) => ({
            ...level,
            isUnlocked: index === 0,
            isCompleted: false,
            lessons: level.lessons.map((lesson, lessonIndex) => ({
              ...lesson,
              isUnlocked: index === 0 && lessonIndex === 0,
              isCompleted: false
            }))
          })),
          videoLessons: videoLessons.map((lesson, index) => ({
            ...lesson,
            isUnlocked: index === 0,
            isCompleted: false
          })),
          currentVideoLesson: null
        });
      }
    }),
    {
      name: 'crypto-education-game',
      version: 1
    }
  )
);
