export const clearStorageIfCorrupted = () => {
  try {
    const stored = localStorage.getItem('crypto-education-game');
    if (stored) {
      const parsed = JSON.parse(stored);
      
      // Check if badges have corrupted earnedAt dates
      if (parsed.state?.user?.badges) {
        const hasBadgeIssues = parsed.state.user.badges.some((badge: any) => 
          badge.earnedAt && typeof badge.earnedAt === 'string' && isNaN(new Date(badge.earnedAt).getTime())
        );
        
        if (hasBadgeIssues) {
          console.warn('Corrupted badge data found, clearing storage');
          localStorage.removeItem('crypto-education-game');
          return true;
        }
      }
    }
  } catch (error) {
    console.warn('Error checking storage, clearing:', error);
    localStorage.removeItem('crypto-education-game');
    return true;
  }
  
  return false;
};

export const fixBadgesDates = (badges: any[]) => {
  return badges.map(badge => ({
    ...badge,
    earnedAt: badge.earnedAt 
      ? typeof badge.earnedAt === 'string' 
        ? new Date(badge.earnedAt) 
        : badge.earnedAt
      : undefined
  }));
};
