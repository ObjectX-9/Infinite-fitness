/**
 * 获取当前周的日期数组（周一到周日）
 * @returns 当前周的日期数组
 */
export const getCurrentWeekDates = (): Date[] => {
  const today = new Date();
  const currentDay = today.getDay(); // 0是周日
  const startOfWeek = new Date(today);

  // 计算周一的日期
  const monday = currentDay === 0 ? -6 : 1 - currentDay;
  startOfWeek.setDate(today.getDate() + monday);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
};
