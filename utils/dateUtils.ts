/**
 * Format date to DD-MM-YYYY HH:mm:ss
 */
export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

/**
 * Get week range from current date going backwards
 * @param weekOffset Number of weeks to go back (0 = current week starting from Monday, 1 = previous week, etc.)
 * @returns { fromDate, toDate } - Start and end of the week
 */
export const getWeekRange = (weekOffset: number = 0) => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate start of current week (Monday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - currentDay + (currentDay === 0 ? -6 : 1)); // Adjust to Monday
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Calculate end of current week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  // Apply week offset (go backwards)
  const fromDate = new Date(startOfWeek);
  fromDate.setDate(startOfWeek.getDate() - (weekOffset * 7));
  
  const toDate = new Date(endOfWeek);
  toDate.setDate(endOfWeek.getDate() - (weekOffset * 7));
  
  return {
    fromDate: formatDate(fromDate),
    toDate: formatDate(toDate)
  };
};

/**
 * Get initial week range (current week)
 */
export const getInitialWeekRange = () => {
  return getWeekRange(0);
};

/**
 * Get next week range for pagination (going backwards in time)
 * @param currentWeekOffset Current week offset
 */
export const getNextWeekRange = (currentWeekOffset: number) => {
  return getWeekRange(currentWeekOffset + 1);
};
