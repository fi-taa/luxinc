"use client";

import { useEffect, useRef } from "react";
import { chatEmojis } from "@/lib/concierge-chat-content";

interface EmojiPickerProps {
	onSelect: (emoji: string) => void;
	onClose: () => void;
}

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
	const panelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handlePointerDown(event: MouseEvent) {
			if (!panelRef.current?.contains(event.target as Node)) {
				onClose();
			}
		}

		function handleEscape(event: KeyboardEvent) {
			if (event.key === "Escape") {
				onClose();
			}
		}

		document.addEventListener("mousedown", handlePointerDown);
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("mousedown", handlePointerDown);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [onClose]);

	return (
		<div
			ref={panelRef}
			className="absolute bottom-full right-0 z-20 mb-2 w-[min(100vw-2rem,280px)] rounded-lg border border-luxinc-border bg-[#1A1A1A] p-3 shadow-lg"
			role="dialog"
			aria-label="Emoji picker"
		>
			<div className="grid grid-cols-8 gap-1">
				{chatEmojis.map((emoji) => (
					<button
						key={emoji}
						type="button"
						onClick={() => onSelect(emoji)}
						className="flex size-8 items-center justify-center rounded-md text-lg transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
					>
						{emoji}
					</button>
				))}
			</div>
		</div>
	);
}
