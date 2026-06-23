export function dateToStringTime(date: Date) {
    return date.toLocaleString('en-US', { timeStyle: 'short'})
}

export function epochToStringDate(epochSecond: number) {
    const startDate = new Date(epochSecond * 1000)
    const startDay = startDate.toLocaleDateString()
    const startTimestamp = startDate.toLocaleString('en-US', { timeStyle: 'short' })
    const start = `${startDay} ${startTimestamp}`
    return start
}

export function isTimeElapsed(epochSecond: number) {
  return (Date.now() / 1000) > epochSecond;
}

/**
 * Converts from 2026-06-25T04:30:53.404Z to 25/06/2026 12:30:53
 * @param isoString 
 * @returns A friendly string.
 */
export function formatISOToFriendly(isoString: string): string {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}