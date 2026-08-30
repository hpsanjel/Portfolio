"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface DynamicListSectionProps<T> {
	title: string;
	items: T[];
	emptyItem: T;
	onChange: (items: T[]) => void;
	renderRow: (item: T, index: number, update: (patch: Partial<T>) => void) => React.ReactNode;
	addLabel: string;
}

export default function DynamicListSection<T>({ title, items, emptyItem, onChange, renderRow, addLabel }: DynamicListSectionProps<T>) {
	const update = (index: number, patch: Partial<T>) => {
		const next = items.slice();
		next[index] = { ...next[index], ...patch };
		onChange(next);
	};

	const addRow = () => {
		onChange([...items, { ...emptyItem }]);
	};

	const removeRow = (index: number) => {
		onChange(items.filter((_, i) => i !== index));
	};

	return (
		<section className="mb-10">
			<h2 className="text-lg font-semibold mb-4">{title}</h2>
			<div className="space-y-4">
				{items.map((item, index) => (
					<div key={index} className="relative border-[0.5px] border-gray-400 dark:border-white/30 rounded-md p-4 pr-12 bg-white dark:bg-darkHover/30">
						<button
							type="button"
							onClick={() => removeRow(index)}
							aria-label={`Remove ${title.toLowerCase()} entry`}
							className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors"
						>
							<Trash2 className="w-4 h-4" />
						</button>
						{renderRow(item, index, (patch) => update(index, patch))}
					</div>
				))}
			</div>
			<button
				type="button"
				onClick={addRow}
				className="mt-4 flex items-center gap-2 text-sm font-medium text-accent hover:text-[#8a5a08] dark:text-[#c17e0a] dark:hover:text-[#eda40d] transition-colors"
			>
				<Plus className="w-4 h-4" /> {addLabel}
			</button>
		</section>
	);
}
