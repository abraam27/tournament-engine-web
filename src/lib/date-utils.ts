function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Format an ISO date for `<input type="datetime-local" />` in the user's local timezone. */
export function toDatetimeLocalValue(isoDate?: string): string {
  if (!isoDate) {
    return "";
  }

  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Parse a `<input type="datetime-local" />` value as local time and return ISO UTC. */
export function fromDatetimeLocalValue(localValue: string): string {
  return new Date(localValue).toISOString();
}
