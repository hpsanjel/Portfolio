"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import { formatTimeLabel, todayDateString } from "@/lib/booking";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATE_LOCALE = "en-GB";

function toDateString(year: number, monthIndex: number, day: number): string {
	return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function monthKey(year: number, monthIndex: number): string {
	return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

export default function BookingWidget() {
	const today = todayDateString();
	const now = new Date();

	const [viewYear, setViewYear] = useState(now.getFullYear());
	const [viewMonth, setViewMonth] = useState(now.getMonth());
	const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
	const [loadingMonth, setLoadingMonth] = useState(true);

	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [availableTimes, setAvailableTimes] = useState<string[]>([]);
	const [loadingTimes, setLoadingTimes] = useState(false);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);

	const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [confirmed, setConfirmed] = useState<{ date: string; time: string } | null>(null);

	useEffect(() => {
		let cancelled = false;
		setLoadingMonth(true);
		fetch(`/api/booking?month=${monthKey(viewYear, viewMonth)}`)
			.then((res) => res.json())
			.then((dates: string[]) => {
				if (!cancelled) setAvailableDates(new Set(Array.isArray(dates) ? dates : []));
			})
			.catch(() => {
				if (!cancelled) setAvailableDates(new Set());
			})
			.finally(() => {
				if (!cancelled) setLoadingMonth(false);
			});
		return () => {
			cancelled = true;
		};
	}, [viewYear, viewMonth]);

	useEffect(() => {
		if (!selectedDate) {
			setAvailableTimes([]);
			return;
		}
		let cancelled = false;
		setLoadingTimes(true);
		setSelectedTime(null);
		fetch(`/api/booking?date=${selectedDate}`)
			.then((res) => res.json())
			.then((times: string[]) => {
				if (!cancelled) setAvailableTimes(Array.isArray(times) ? times : []);
			})
			.catch(() => {
				if (!cancelled) setAvailableTimes([]);
			})
			.finally(() => {
				if (!cancelled) setLoadingTimes(false);
			});
		return () => {
			cancelled = true;
		};
	}, [selectedDate]);

	const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
	const rawFirstWeekday = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sunday
	const firstWeekday = (rawFirstWeekday + 6) % 7; // 0 = Monday

	const isViewingCurrentOrPastMonth = viewYear < now.getFullYear() || (viewYear === now.getFullYear() && viewMonth <= now.getMonth());

	const goPrevMonth = () => {
		setSelectedDate(null);
		if (viewMonth === 0) {
			setViewYear(viewYear - 1);
			setViewMonth(11);
		} else {
			setViewMonth(viewMonth - 1);
		}
	};
	const goNextMonth = () => {
		setSelectedDate(null);
		if (viewMonth === 11) {
			setViewYear(viewYear + 1);
			setViewMonth(0);
		} else {
			setViewMonth(viewMonth + 1);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedDate || !selectedTime) return;
		setSubmitting(true);
		setError("");
		try {
			const res = await fetch("/api/booking", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ date: selectedDate, time: selectedTime, ...form }),
			});
			const result = await res.json();
			if (res.ok) {
				setConfirmed({ date: selectedDate, time: selectedTime });
			} else if (res.status === 409) {
				setError(result.message || "That slot was just taken. Please choose another time.");
				setSelectedTime(null);
				const timesRes = await fetch(`/api/booking?date=${selectedDate}`);
				setAvailableTimes(await timesRes.json());
			} else {
				setError(result.message || "Something went wrong. Please try again.");
			}
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	if (confirmed) {
		return (
			<div className="max-w-lg mx-auto text-center bg-white/80 dark:bg-darkHover/40 border border-gray-200/70 dark:border-white/10 rounded-3xl p-10">
				<CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" aria-hidden="true" />
				<h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">You&apos;re booked!</h3>
				<p className="text-gray-600 dark:text-gray-300">
					Your meeting is confirmed for{" "}
					<strong>
						{new Date(`${confirmed.date}T00:00:00`).toLocaleDateString(DATE_LOCALE, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
					</strong>{" "}
					at <strong>{formatTimeLabel(confirmed.time)}</strong>. A confirmation has been sent — we&apos;ll be in touch shortly.
				</p>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
			{/* Calendar + time slots */}
			<div className="bg-white/80 dark:bg-darkHover/40 border border-gray-200/70 dark:border-white/10 rounded-2xl p-6">
				<div className="flex items-center justify-between mb-4">
					<button
						type="button"
						onClick={goPrevMonth}
						disabled={isViewingCurrentOrPastMonth}
						aria-label="Previous month"
						className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 dark:border-white/15 text-gray-600 dark:text-gray-300 hover:border-[#eda40d] hover:text-accent dark:hover:text-[#eda40d] disabled:opacity-30 disabled:hover:border-gray-300 dark:disabled:hover:border-white/15 disabled:cursor-not-allowed transition-colors duration-200"
					>
						<ChevronLeft className="w-4.5 h-4.5" />
					</button>
					<span className="font-semibold text-gray-900 dark:text-white">{new Date(viewYear, viewMonth, 1).toLocaleDateString(DATE_LOCALE, { month: "long", year: "numeric" })}</span>
					<button
						type="button"
						onClick={goNextMonth}
						aria-label="Next month"
						className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 dark:border-white/15 text-gray-600 dark:text-gray-300 hover:border-[#eda40d] hover:text-accent dark:hover:text-[#eda40d] transition-colors duration-200"
					>
						<ChevronRight className="w-4.5 h-4.5" />
					</button>
				</div>

				<div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
					{WEEKDAY_LABELS.map((d) => (
						<div key={d}>{d}</div>
					))}
				</div>

				{loadingMonth ? (
					<div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
					</div>
				) : (
					<div className="grid grid-cols-7 gap-1">
						{Array.from({ length: firstWeekday }).map((_, i) => (
							<div key={`pad-${i}`} aria-hidden="true" />
						))}
						{Array.from({ length: daysInMonth }).map((_, i) => {
							const day = i + 1;
							const dateStr = toDateString(viewYear, viewMonth, day);
							const isPast = dateStr < today;
							const isAvailable = availableDates.has(dateStr);
							const isSelected = dateStr === selectedDate;
							return (
								<button
									key={dateStr}
									type="button"
									disabled={isPast || !isAvailable}
									onClick={() => setSelectedDate(dateStr)}
									aria-pressed={isSelected}
									aria-label={`${dateStr}${isPast ? ", in the past" : isAvailable ? ", has available times" : ", no available times"}`}
									className={`aspect-square rounded-lg text-sm flex items-center justify-center transition-colors duration-150 ${
										isSelected
											? "bg-linear-to-r from-[#eda40d] to-[#c17e0a] text-gray-900 font-semibold"
											: isPast || !isAvailable
											? "text-gray-300 dark:text-gray-700 cursor-not-allowed"
											: "text-gray-700 dark:text-gray-300 hover:bg-[#eda40d]/10 border border-transparent hover:border-[#eda40d]/40 cursor-pointer"
									}`}
								>
									{day}
								</button>
							);
						})}
					</div>
				)}

				{!loadingMonth && availableDates.size === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">No open times this month yet — try another month or reach out directly.</p>}

				{selectedDate && (
					<div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
						<h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
							<Clock className="w-4 h-4" aria-hidden="true" />
							Available times
						</h4>
						{loadingTimes ? (
							<div className="flex justify-center py-4">
								<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
							</div>
						) : availableTimes.length === 0 ? (
							<p className="text-sm text-gray-500 dark:text-gray-400">No times left on this date.</p>
						) : (
							<div className="grid grid-cols-3 gap-2">
								{availableTimes.map((time) => (
									<button
										key={time}
										type="button"
										onClick={() => setSelectedTime(time)}
										aria-pressed={selectedTime === time}
										className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors duration-150 ${
											selectedTime === time ? "bg-linear-to-r from-[#eda40d] to-[#c17e0a] text-gray-900 border-transparent" : "border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-[#eda40d]"
										}`}
									>
										{formatTimeLabel(time)}
									</button>
								))}
							</div>
						)}
					</div>
				)}
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className={`bg-white/80 dark:bg-darkHover/40 border border-gray-200/70 dark:border-white/10 rounded-2xl p-6 h-max transition-opacity duration-200 ${!selectedTime ? "opacity-50" : ""}`}>
				<fieldset disabled={!selectedTime} className="contents">
					<h4 className="font-semibold text-gray-900 dark:text-white mb-1">Your details</h4>
					<p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
						{selectedDate && selectedTime ? (
							<>
								Booking for{" "}
								<strong>{new Date(`${selectedDate}T00:00:00`).toLocaleDateString(DATE_LOCALE, { weekday: "long", month: "long", day: "numeric" })}</strong> at <strong>{formatTimeLabel(selectedTime)}</strong>
							</>
						) : (
							"Pick a date and time first."
						)}
					</p>

					<div className="space-y-4">
						<div>
							<label htmlFor="booking-name" className="sr-only">
								Your name
							</label>
							<input id="booking-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90" />
						</div>
						<div>
							<label htmlFor="booking-email" className="sr-only">
								Your email
							</label>
							<input id="booking-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Your email" className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90" />
						</div>
						<div>
							<label htmlFor="booking-phone" className="sr-only">
								Your phone number
							</label>
							<input id="booking-phone" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Your phone number" className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90" />
						</div>
						<div>
							<label htmlFor="booking-message" className="sr-only">
								What would you like to discuss? (optional)
							</label>
							<textarea id="booking-message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="What would you like to discuss? (optional)" className="w-full p-3 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-darkHover/30 dark:border-white/90" />
						</div>
					</div>

					{error && (
						<div role="alert" className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
							{error}
						</div>
					)}

					<button type="submit" disabled={submitting || !selectedTime} className="w-full mt-5 px-6 py-3 rounded-full bg-linear-to-r from-[#eda40d] to-[#c17e0a] text-gray-900 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
						{submitting ? "Booking..." : "Confirm Booking"}
					</button>
				</fieldset>
			</form>
		</div>
	);
}
