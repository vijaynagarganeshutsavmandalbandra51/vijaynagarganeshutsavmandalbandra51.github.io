/** Where we are relative to the festival dates in mandal.json. */
export type FestivalPhase =
  | { kind: 'upcoming'; days: number; hours: number; minutes: number; seconds: number }
  | { kind: 'ongoing'; dayNumber: number; totalDays: number }
  | { kind: 'over' };

const DAY_MS = 24 * 60 * 60 * 1000;

export function festivalPhase(now: number, startIso: string, visarjanIso: string): FestivalPhase {
  const start = new Date(startIso).getTime();
  const end = new Date(visarjanIso).getTime();

  if (now < start) {
    let diff = Math.floor((start - now) / 1000);
    const days = Math.floor(diff / 86400);
    diff -= days * 86400;
    const hours = Math.floor(diff / 3600);
    diff -= hours * 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = diff - minutes * 60;
    return { kind: 'upcoming', days, hours, minutes, seconds };
  }

  // Keep the "ongoing" state until the end of visarjan day.
  const endOfVisarjanDay = new Date(visarjanIso);
  endOfVisarjanDay.setHours(23, 59, 59, 999);
  if (now <= Math.max(end, endOfVisarjanDay.getTime())) {
    const startDay = new Date(startIso);
    startDay.setHours(0, 0, 0, 0);
    const dayNumber = Math.floor((now - startDay.getTime()) / DAY_MS) + 1;
    const totalDays = Math.round((new Date(visarjanIso).setHours(0, 0, 0, 0) - startDay.getTime()) / DAY_MS) + 1;
    return { kind: 'ongoing', dayNumber, totalDays };
  }

  return { kind: 'over' };
}

/** Today's date as yyyy-MM-dd in the visitor's local time zone. */
export function todayIso(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}
