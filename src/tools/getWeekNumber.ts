export function getWeekNumber(timestamp: number | string) {
    const date = new Date(Number(timestamp));
    // Get the day of week (0=Sun, 1=Mon, ..., 6=Sat)
    const day = date.getUTCDay();
    // Calculate how many days to subtract to get to Monday
    const daysToMonday = day === 0 ? 6 : day - 1;
    // Create a new date at Monday 00:00:00 of this week
    const monday = new Date(date);
    monday.setUTCDate(date.getUTCDate() - daysToMonday);
    monday.setUTCHours(0, 0, 0, 0);
    
    // Reference point (Monday, January 5, 1970 - first Monday after Unix epoch)
    const firstMonday = new Date(Date.UTC(1970, 0, 5));
    
    // Calculate full weeks between dates
    return Math.floor((monday.getTime() - firstMonday.getTime()) / (7 * 24 * 60 * 60 * 1000));
}