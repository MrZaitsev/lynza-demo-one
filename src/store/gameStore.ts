import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Level, Badge, Achievement } from '../types/game';
import { levels, badges, achievements } from '../data/gameData';

interface GameState {
  user: User;
  levels: Level[];
  availableBadges: Badge[];
  achievements: Achievement[];
  
  // Actions
  initializeUser: (telegramUser: any) => void;
  completeLesson: (lessonId: string) => void;
  unlockLevel: (levelId: number) => void;
  awardBadge: (badgeId: string) => void;
  addCoins: (amount: number) => void;
  addExperience: (amount: number) => void;
  checkAchievements: () => void;
  resetProgress: () => void;
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
      availableBadges: badges,
      achievements: achievements,

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
          }))
        });
      }
    }),
    {
      name: 'crypto-education-game',
      version: 1
    }
  )
);
