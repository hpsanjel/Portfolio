import { Phone, Mail } from "lucide-react";

export default function TopInfoBar() {
	return (
		<div className="flex fixed top-0 inset-x-0 z-50 h-8 sm:h-9 items-center justify-center sm:justify-end gap-3 sm:gap-6 px-3 sm:px-5 lg:px-8 xl:px-[8%] bg-linear-to-r from-[#1c1305] via-gray-900 to-[#05070d] text-gray-300 text-[11px] sm:text-xs overflow-hidden">
			<a href="tel:+4746344530" className="flex items-center gap-1.5 whitespace-nowrap hover:text-yellow-400 transition-colors duration-200">
				<Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
				+47 46344530
			</a>
			<a href="mailto:harisanjel@gmail.com" className="flex items-center gap-1.5 whitespace-nowrap hover:text-yellow-400 transition-colors duration-200">
				<Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
				harisanjel@gmail.com
			</a>
		</div>
	);
}
