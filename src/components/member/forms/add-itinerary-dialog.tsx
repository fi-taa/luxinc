"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
	isoDateToTravelLabel,
	timeValueToStopLabel,
	todayIsoDate,
} from "@/lib/member/date-format";
import {
	travelDnaDestinationCategories,
	travelDnaTopicOptions,
} from "@/lib/member/travel-dna-taxonomy";
import { MemberDateInput } from "./member-date-input";
import { MemberImageUpload } from "./member-image-upload";
import { MemberTimeInput } from "./member-time-input";
import {
	MemberDialog,
	MemberField,
	memberInputClassName,
	memberLabelClassName,
} from "./member-form-ui";

interface StopField {
	stopTime: string;
	activity: string;
}

interface AddItineraryDialogProps {
	open: boolean;
	kind: "upcoming" | "past";
	onClose: () => void;
}

const defaultStops: StopField[] = [
	{ stopTime: "08:00", activity: "" },
	{ stopTime: "11:30", activity: "" },
];

export function AddItineraryDialog({ open, kind, onClose }: AddItineraryDialogProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [travelDateIso, setTravelDateIso] = useState(todayIsoDate);
	const [stops, setStops] = useState<StopField[]>(defaultStops);
	const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [imageAlt, setImageAlt] = useState("");

	const title = kind === "upcoming" ? "Add upcoming itinerary" : "Add past journey";
	const isPast = kind === "past";

	function resetForm() {
		setTravelDateIso(todayIsoDate());
		setStops(defaultStops.map((stop) => ({ ...stop })));
		setSelectedTopics([]);
		setImageUrl(null);
		setImageAlt("");
		setError(null);
	}

	function toggleTopic(topic: string) {
		setSelectedTopics((current) =>
			current.includes(topic)
				? current.filter((item) => item !== topic)
				: [...current, topic],
		);
	}

	function handleClose() {
		resetForm();
		onClose();
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);

		const formData = new FormData(event.currentTarget);
		const travelDateLabel = isoDateToTravelLabel(travelDateIso);

		const payload = {
			kind,
			destination: String(formData.get("destination") ?? ""),
			travelDateLabel,
			destinationCategory: String(formData.get("destinationCategory") ?? ""),
			topicTags: selectedTopics,
			imageUrl: imageUrl ?? "",
			imageAlt: imageAlt.trim(),
			stops: stops.map((stop) => ({
				stopTime: timeValueToStopLabel(stop.stopTime),
				activity: stop.activity,
			})),
		};

		try {
			const response = await fetch("/api/member/itineraries", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const body = (await response.json()) as { error?: string };
			if (!response.ok) {
				throw new Error(body.error ?? "Failed to save itinerary");
			}
			handleClose();
			router.refresh();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to save");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<MemberDialog
			open={open}
			title={title}
			onClose={handleClose}
			onSubmit={handleSubmit}
			submitLabel="Save itinerary"
			isSubmitting={isSubmitting}
			error={error}
			panelClassName={isPast ? "max-w-md" : undefined}
		>
			<MemberField label="Destination">
				<input
					name="destination"
					required
					className={memberInputClassName}
					placeholder="Tanzania"
				/>
			</MemberField>
			<MemberField label="Travel date">
				<MemberDateInput
					value={travelDateIso}
					onChange={setTravelDateIso}
					required
				/>
			</MemberField>
			{isPast ? (
				<>
					<MemberField label="Destination type (for Travel DNA)">
						<select
							name="destinationCategory"
							className={memberInputClassName}
							defaultValue=""
						>
							<option value="">Select a category</option>
							{travelDnaDestinationCategories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</MemberField>
					<div className="flex flex-col gap-2">
						<p className={memberLabelClassName}>Travel topics (for Travel DNA)</p>
						<div className="flex flex-wrap gap-2">
							{travelDnaTopicOptions.map((topic) => {
								const isSelected = selectedTopics.includes(topic);
								return (
									<button
										key={topic}
										type="button"
										onClick={() => toggleTopic(topic)}
										className={`rounded-full border px-3 py-1 font-sans text-sm transition-colors ${
											isSelected
												? "border-luxinc-gold bg-luxinc-gold/20 text-luxinc-gold"
												: "border-luxinc-border text-luxinc-text hover:border-luxinc-gold/60"
										}`}
									>
										{topic}
									</button>
								);
							})}
						</div>
					</div>
				</>
			) : null}
			<MemberImageUpload
				scope="itineraries"
				imageUrl={imageUrl}
				onImageUrlChange={setImageUrl}
				imageAlt={imageAlt}
				onImageAltChange={setImageAlt}
			/>
			<div className="flex flex-col gap-3">
				<p className={memberLabelClassName}>Stops</p>
				{stops.map((stop, index) => (
					<div key={index} className="grid gap-2 sm:grid-cols-2">
						<MemberTimeInput
							value={stop.stopTime}
							onChange={(timeValue) => {
								const next = [...stops];
								next[index] = { ...next[index], stopTime: timeValue };
								setStops(next);
							}}
							required
						/>
						<input
							value={stop.activity}
							onChange={(e) => {
								const next = [...stops];
								next[index] = { ...next[index], activity: e.target.value };
								setStops(next);
							}}
							className={memberInputClassName}
							placeholder="Activity"
							required
						/>
					</div>
				))}
				<button
					type="button"
					onClick={() => setStops([...stops, { stopTime: "", activity: "" }])}
					className="self-start font-sans text-sm text-luxinc-gold underline-offset-4 hover:underline"
				>
					+ Add another stop
				</button>
			</div>
		</MemberDialog>
	);
}
