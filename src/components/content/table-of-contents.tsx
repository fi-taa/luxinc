"use client";

import { useState } from "react";
import type { TableOfContentsItem } from "@/lib/content-detail";

interface TableOfContentsProps {
	items: TableOfContentsItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
	const [isOpen, setIsOpen] = useState(false);

	if (items.length === 0) return null;

	return (
		<div className="mt-10 text-center">
			<p className="font-sans text-sm text-luxinc-text">
				Table of Contents{" "}
				<button
					type="button"
					onClick={() => setIsOpen((open) => !open)}
					className="text-luxinc-text underline decoration-luxinc-text/50 underline-offset-4 transition-colors hover:text-luxinc-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold focus-visible:ring-offset-2 focus-visible:ring-offset-luxinc-bg"
				>
					{isOpen ? "hide" : "show"}
				</button>
			</p>
			{isOpen ? (
				<nav
					aria-label="Table of contents"
					className="mx-auto mt-4 max-w-md space-y-2"
				>
					{items.map((item) => (
						<a
							key={item.id}
							href={`#${item.id}`}
							className="block font-sans text-sm text-luxinc-text/90 transition-colors hover:text-luxinc-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
						>
							{item.label}
						</a>
					))}
				</nav>
			) : null}
		</div>
	);
}
