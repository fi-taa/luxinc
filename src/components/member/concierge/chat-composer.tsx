"use client";

import { Mic, Paperclip, Send, Smile, Square } from "lucide-react";
import { useRef, useState } from "react";
import {
	conciergeAssistant,
	maxChatFileBytes,
} from "@/lib/concierge-chat-content";
import { cn } from "@/lib/utils";
import { EmojiPicker } from "./emoji-picker";
import { useVoiceRecorder } from "./use-voice-recorder";

interface ChatComposerProps {
	onSendText: (text: string) => void;
	onSendVoice: (audioUrl: string, durationSeconds: number) => void;
	onSendFile: (file: File, fileUrl: string) => void;
	disabled?: boolean;
}

export function ChatComposer({
	onSendText,
	onSendVoice,
	onSendFile,
	disabled = false,
}: ChatComposerProps) {
	const [draft, setDraft] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [composerError, setComposerError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const { isRecording, startRecording, stopRecording } = useVoiceRecorder({
		onComplete: ({ audioUrl, durationSeconds }) => {
			setComposerError(null);
			onSendVoice(audioUrl, durationSeconds);
		},
		onError: (message) => setComposerError(message),
	});

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const trimmed = draft.trim();
		if (!trimmed || disabled || isRecording) {
			return;
		}
		onSendText(trimmed);
		setDraft("");
		setShowEmojiPicker(false);
	}

	function handleEmojiSelect(emoji: string) {
		setDraft((current) => `${current}${emoji}`);
		setShowEmojiPicker(false);
		inputRef.current?.focus();
	}

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file || disabled || isRecording) {
			return;
		}

		if (file.size > maxChatFileBytes) {
			setComposerError("File must be 10MB or smaller.");
			return;
		}

		setComposerError(null);
		const fileUrl = URL.createObjectURL(file);
		onSendFile(file, fileUrl);
	}

	async function handleVoiceClick() {
		if (disabled) {
			return;
		}
		setComposerError(null);
		if (isRecording) {
			stopRecording();
			return;
		}
		await startRecording();
	}

	return (
		<div className="relative border-t border-luxinc-border/60 bg-[#1A1A1A]">
			{composerError ? (
				<p className="px-4 pt-2 font-sans text-xs text-[#FF7F50]" role="status">
					{composerError}
				</p>
			) : null}
			{isRecording ? (
				<p className="px-4 pt-2 font-sans text-xs text-luxinc-gold" role="status">
					Recording… tap the square to send your voice note.
				</p>
			) : null}

			<form
				onSubmit={handleSubmit}
				className="flex items-center gap-2 px-3 py-3 md:px-4"
			>
				<input
					ref={fileInputRef}
					type="file"
					className="sr-only"
					accept="image/*,.pdf,.doc,.docx,.txt"
					onChange={handleFileChange}
				/>
				<button
					type="button"
					disabled={disabled || isRecording}
					onClick={() => fileInputRef.current?.click()}
					className="flex size-10 shrink-0 items-center justify-center text-luxinc-text-muted transition-colors hover:text-luxinc-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold disabled:opacity-40"
					aria-label="Attach file"
				>
					<Paperclip className="size-5" aria-hidden />
				</button>
				<input
					ref={inputRef}
					type="text"
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					disabled={disabled || isRecording}
					placeholder={`Message to ${conciergeAssistant.name}...`}
					className="min-w-0 flex-1 border-0 bg-transparent py-2.5 font-sans text-sm text-luxinc-text placeholder:text-luxinc-text-muted focus-visible:outline-none disabled:opacity-40"
				/>
				<div className="relative hidden sm:block">
					<button
						type="button"
						disabled={disabled || isRecording}
						onClick={() => setShowEmojiPicker((open) => !open)}
						className={cn(
							"flex size-10 shrink-0 items-center justify-center text-luxinc-text-muted transition-colors hover:text-luxinc-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold disabled:opacity-40",
							showEmojiPicker && "text-luxinc-gold",
						)}
						aria-label="Add emoji"
						aria-expanded={showEmojiPicker}
					>
						<Smile className="size-5" aria-hidden />
					</button>
					{showEmojiPicker ? (
						<EmojiPicker
							onSelect={handleEmojiSelect}
							onClose={() => setShowEmojiPicker(false)}
						/>
					) : null}
				</div>
				<button
					type="button"
					disabled={disabled}
					onClick={handleVoiceClick}
					className={cn(
						"flex size-10 shrink-0 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold disabled:opacity-40",
						isRecording
							? "text-[#FF7F50] hover:text-[#FF7F50]"
							: "text-luxinc-text-muted hover:text-luxinc-text",
					)}
					aria-label={isRecording ? "Stop recording" : "Record voice message"}
				>
					{isRecording ? (
						<Square className="size-4 fill-current" aria-hidden />
					) : (
						<Mic className="size-5" aria-hidden />
					)}
				</button>
				<button
					type="submit"
					disabled={disabled || isRecording || !draft.trim()}
					className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-luxinc-gold px-4 font-sans text-sm font-semibold text-luxinc-bg transition-colors hover:bg-luxinc-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-40"
					aria-label="Send message"
				>
					<span className="hidden sm:inline">Send</span>
					<Send className="size-4" aria-hidden />
				</button>
			</form>

			<div className="relative px-3 pb-3 sm:hidden">
				<button
					type="button"
					disabled={disabled || isRecording}
					onClick={() => setShowEmojiPicker((open) => !open)}
					className={cn(
						"flex size-10 items-center justify-center text-luxinc-text-muted transition-colors hover:text-luxinc-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold disabled:opacity-40",
						showEmojiPicker && "text-luxinc-gold",
					)}
					aria-label="Add emoji"
					aria-expanded={showEmojiPicker}
				>
					<Smile className="size-5" aria-hidden />
				</button>
				{showEmojiPicker ? (
					<EmojiPicker
						onSelect={handleEmojiSelect}
						onClose={() => setShowEmojiPicker(false)}
					/>
				) : null}
			</div>
		</div>
	);
}
