"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	conciergeAssistant,
	createUserFileMessage,
	createUserTextMessage,
	createUserVoiceMessage,
	type ConciergeChatMessage,
} from "@/lib/concierge-chat-content";
import { ChatComposer } from "./chat-composer";
import { ChatMessage } from "./chat-message";

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

interface ConciergeChatProps {
	initialMessages: ConciergeChatMessage[];
	loadError?: string | null;
}

export function ConciergeChat({ initialMessages, loadError }: ConciergeChatProps) {
	const [messages, setMessages] = useState<ConciergeChatMessage[]>(initialMessages);
	const [isReplying, setIsReplying] = useState(false);
	const [sendError, setSendError] = useState<string | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesRef = useRef(messages);

	messagesRef.current = messages;

	useEffect(() => {
		setMessages(initialMessages);
	}, [initialMessages]);

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages, isReplying, scrollToBottom]);

	useEffect(() => {
		return () => {
			collectBlobUrls(messagesRef.current).forEach((url) => {
				URL.revokeObjectURL(url);
			});
		};
	}, []);

	const persistUserMessage = useCallback(async (message: ConciergeChatMessage) => {
		setSendError(null);
		setIsReplying(true);

		const optimisticMessages = [...messagesRef.current, message];
		setMessages(optimisticMessages);

		try {
			const response = await fetch("/api/member/concierge/messages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message }),
			});
			const body = (await response.json()) as {
				messages?: ConciergeChatMessage[];
				error?: string;
			};

			if (!response.ok) {
				throw new Error(body.error ?? "Failed to send message");
			}

			if (body.messages?.length) {
				setMessages((current) => {
					const withoutOptimistic = current.filter((item) => item.id !== message.id);
					return [...withoutOptimistic, ...body.messages!];
				});
			}
		} catch (e) {
			setMessages(messagesRef.current.filter((item) => item.id !== message.id));
			setSendError(e instanceof Error ? e.message : "Failed to send message");
		} finally {
			setIsReplying(false);
		}
	}, []);

	const handleSendText = useCallback(
		(text: string) => {
			void persistUserMessage(createUserTextMessage(text));
		},
		[persistUserMessage],
	);

	const handleSendVoice = useCallback(
		(audioUrl: string, durationSeconds: number) => {
			void persistUserMessage(createUserVoiceMessage(audioUrl, durationSeconds));
		},
		[persistUserMessage],
	);

	const handleSendFile = useCallback(
		(file: File, fileUrl: string) => {
			void persistUserMessage(createUserFileMessage(file, fileUrl));
		},
		[persistUserMessage],
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
				{loadError ? (
					<p className="px-4 py-6 font-sans text-sm text-red-400 md:px-6">{loadError}</p>
				) : null}
				{!loadError && messages.length === 0 ? (
					<p className="px-4 py-2 font-sans text-sm text-luxinc-text-muted md:px-6">
						No messages yet. Type below to start your concierge conversation.
					</p>
				) : null}
				{sendError ? (
					<p className="px-4 pt-4 font-sans text-sm text-red-400 md:px-6">{sendError}</p>
				) : null}
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
						disabled={isReplying || Boolean(loadError)}
					/>
				</div>
			</div>
		</section>
	);
}
