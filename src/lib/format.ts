const locale = 'en-GB';
const timeZone = 'Europe/London';

const shortDate = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone });
const longDate = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone });
const fullDate = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone });
const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', timeZone });
const dayKey = new Intl.DateTimeFormat('en-CA', { timeZone });

export const formatDate = (date: Date) => longDate.format(date);
export const formatFullDate = (date: Date) => fullDate.format(date);
export const formatTime = (date: Date) => time.format(date);

/** Time of day for stories from the same day as `reference`, otherwise a short date. */
export function formatStamp(date: Date, reference: Date) {
  return dayKey.format(date) === dayKey.format(reference) ? time.format(date) : shortDate.format(date);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((part) => /^[A-Za-z]/.test(part))
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
