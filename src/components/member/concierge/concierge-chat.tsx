"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	conciergeAssistant,
	conciergeReplyDelayMs,
	createConciergeTextMessage,
	createUserFileMessage,
	createUserTextMessage,
	createUserVoiceMessage,
	getDummyConciergeReply,
	getReplyContextFromMessage,
	initialConciergeChatMessages,
	type ConciergeChatMessage,
} from "@/lib/concierge-chat-content";
import { ChatComposer } from "./chat-composer";
import { ChatMessage } from "./chat-message";

function replyDelayMs(): number {
	const { min, max } = conciergeReplyDelayMs;
	return min + Math.floor(Math.random() * (max - min + 1));
}

function collectBlobUrls(messages: ConciergeChatMessage[]): string[] {
	return messages.flatMap((message) => {
		const urls: string[] = [];
		if (message.voiceAudioUrl?.startsWith("blob:")) {
			urls.push(message.voiceAudioUrl);
		}
		if (message.fileUrl?.startsWith("blob:")) {
			urls.push(message.fileUrl);
		}
		return urls;
	});
}

export function ConciergeChat() {
	const [messages, setMessages] = useState<ConciergeChatMessage[]>(
		initialConciergeChatMessages,
	);
	const [isReplying, setIsReplying] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const replyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const messagesRef = useRef(messages);

	messagesRef.current = messages;

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages, isReplying, scrollToBottom]);

	useEffect(() => {
		return () => {
			if (replyTimeoutRef.current) {
				clearTimeout(replyTimeoutRef.current);
			}
			collectBlobUrls(messagesRef.current).forEach((url) => {
				URL.revokeObjectURL(url);
			});
		};
	}, []);

	const queueDummyReply = useCallback((context: string) => {
		setIsReplying(true);

		replyTimeoutRef.current = setTimeout(() => {
			const reply = getDummyConciergeReply(context);
			setMessages((current) => [...current, createConciergeTextMessage(reply)]);
			setIsReplying(false);
			replyTimeoutRef.current = null;
		}, replyDelayMs());
	}, []);

	const sendUserMessage = useCallback(
		(message: ConciergeChatMessage) => {
			setMessages((current) => [...current, message]);
			queueDummyReply(getReplyContextFromMessage(message));
		},
		[queueDummyReply],
	);

	const handleSendText = useCallback(
		(text: string) => {
			sendUserMessage(createUserTextMessage(text));
		},
		[sendUserMessage],
	);

	const handleSendVoice = useCallback(
		(audioUrl: string, durationSeconds: number) => {
			sendUserMessage(createUserVoiceMessage(audioUrl, durationSeconds));
		},
		[sendUserMessage],
	);

	const handleSendFile = useCallback(
		(file: File, fileUrl: string) => {
			sendUserMessage(createUserFileMessage(file, fileUrl));
		},
		[sendUserMessage],
	);

	return (
		<section
			aria-labelledby="concierge-chat-heading"
			className="flex h-[min(720px,calc(100vh-14rem))] max-h-[min(720px,calc(100vh-14rem))] flex-col overflow-hidden border border-luxinc-gold/35 bg-luxinc-panel/30"
		>
			<header className="shrink-0 border-b border-luxinc-border/60 px-5 py-4 md:px-6">
				<h1
					id="concierge-chat-heading"
					className="font-sans text-base font-medium text-luxinc-text md:text-lg"
				>
					24/7 Concierge Chat
				</h1>
			</header>

			<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
				<div
					className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-y-contain px-4 py-6 md:px-6"
					role="log"
					aria-live="polite"
					aria-relevant="additions"
				>
					{messages.map((message) => (
						<ChatMessage key={message.id} message={message} />
					))}
					{isReplying ? (
						<div className="flex gap-3">
							<div
								className="flex size-9 shrink-0 items-center justify-center rounded-full bg-luxinc-gold font-sans text-xs font-semibold text-luxinc-bg"
								aria-hidden
							>
								{conciergeAssistant.initials}
							</div>
							<div className="rounded-2xl rounded-tl-sm bg-[#1A1A1A] px-4 py-3">
								<p className="font-sans text-sm text-luxinc-text-muted">
									{conciergeAssistant.name} is typing…
								</p>
							</div>
						</div>
					) : null}
					<div ref={messagesEndRef} className="h-px shrink-0" aria-hidden />
				</div>
				<div className="shrink-0">
					<ChatComposer
						onSendText={handleSendText}
						onSendVoice={handleSendVoice}
						onSendFile={handleSendFile}
						disabled={isReplying}
					/>
				</div>
			</div>
		</section>
	);
}
