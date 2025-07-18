export function getWeekNumber(timestamp: number | string): number {
    const date = new Date(Number(timestamp))

    // Use LOCAL date components (not UTC)
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    // Get day of week (0=Sun, 1=Mon, ..., 6=Sat)
    const day = localDate.getDay()

    // Calculate days to Monday (if Sunday, go back 6 days)
    const daysToMonday = day === 0 ? 6 : day - 1

    // Get Monday at 00:00:00 LOCAL TIME of this week
    const monday = new Date(localDate)
    monday.setDate(localDate.getDate() - daysToMonday)

    // Reference point (Monday, January 5, 1970 LOCAL TIME)
    const firstMonday = new Date(1970, 0, 5)

    // Calculate full weeks between dates
    const diffMs = monday.getTime() - firstMonday.getTime()
    const weeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000))

    return weeks
}
