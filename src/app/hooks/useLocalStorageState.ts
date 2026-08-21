"use client";

import { useEffect, useRef, useState } from "react";

export default function useLocalStorageState<T>(key: string, initialValue: T, debounceMs = 400) {
	const [state, setState] = useState<T>(initialValue);
	const [hydrated, setHydrated] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(key);
			if (raw) setState(JSON.parse(raw));
		} catch {}
		setHydrated(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key]);

	useEffect(() => {
		if (!hydrated) return;
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			try {
				localStorage.setItem(key, JSON.stringify(state));
			} catch {}
		}, debounceMs);
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [key, state, hydrated, debounceMs]);

	const clear = () => {
		try {
			localStorage.removeItem(key);
		} catch {}
		setState(initialValue);
	};

	return { state, setState, clear, hydrated } as const;
}
