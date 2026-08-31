export const BOOKING_START_HOUR = 9;
export const BOOKING_END_HOUR = 17;

// 1-hour slots from 09:00 up to (not including) 17:00 — e.g. "09:00" is the 09:00–10:00 slot.
export const TIME_SLOTS: string[] = Array.from({ length: BOOKING_END_HOUR - BOOKING_START_HOUR }, (_, i) => `${String(BOOKING_START_HOUR + i).padStart(2, "0")}:00`);

export function isValidTimeSlot(time: string): boolean {
	return TIME_SLOTS.includes(time);
}

export function isValidDateString(date: string): boolean {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
	const parsed = new Date(`${date}T00:00:00`);
	return !Number.isNaN(parsed.getTime());
}

export function isValidMonthString(month: string): boolean {
	return /^\d{4}-\d{2}$/.test(month);
}

export function formatTimeLabel(time: string): string {
	const hour = parseInt(time.split(":")[0], 10);
	const period = hour >= 12 ? "PM" : "AM";
	const displayHour = hour % 12 === 0 ? 12 : hour % 12;
	return `${displayHour}:00 ${period}`;
}

export function todayDateString(): string {
	const now = new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
