"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	voiceWaveformHeights,
	type ConciergeChatMessage,
} from "@/lib/concierge-chat-content";

interface VoiceMessagePlayerProps {
	message: ConciergeChatMessage;
}

export function VoiceMessagePlayer({ message }: VoiceMessagePlayerProps) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) {
			return;
		}

		function handleEnded() {
			setIsPlaying(false);
		}

		audio.addEventListener("ended", handleEnded);
		return () => audio.removeEventListener("ended", handleEnded);
	}, [message.voiceAudioUrl]);

	function togglePlayback() {
		const audio = audioRef.current;
		if (!audio || !message.voiceAudioUrl) {
			return;
		}

		if (isPlaying) {
			audio.pause();
			setIsPlaying(false);
			return;
		}

		void audio.play();
		setIsPlaying(true);
	}

	return (
		<div className="flex min-w-[220px] max-w-full items-center gap-3 sm:min-w-[280px]">
			{message.voiceAudioUrl ? (
				<audio ref={audioRef} src={message.voiceAudioUrl} className="hidden">
					<track kind="captions" />
				</audio>
			) : null}
			<button
				type="button"
				onClick={togglePlayback}
				disabled={!message.voiceAudioUrl}
				className="flex size-9 shrink-0 items-center justify-center rounded-full bg-luxinc-bg/25 transition-colors hover:bg-luxinc-bg/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-bg disabled:opacity-50"
				aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
			>
				{isPlaying ? (
					<Pause className="size-4 fill-luxinc-bg text-luxinc-bg" aria-hidden />
				) : (
					<Play className="size-4 fill-luxinc-bg text-luxinc-bg" aria-hidden />
				)}
			</button>
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<div className="flex h-6 items-center gap-0.5">
					{voiceWaveformHeights.map((height, index) => (
						<span
							key={`${message.id}-bar-${index}`}
							className="w-0.5 shrink-0 rounded-full bg-luxinc-bg/85"
							style={{ height: `${height * 2}px` }}
							aria-hidden
						/>
					))}
				</div>
				<div className="flex justify-between font-sans text-[11px] text-luxinc-bg/90">
					<span>{message.voiceDuration}</span>
					<span>{message.voiceTotal}</span>
				</div>
			</div>
		</div>
	);
}
