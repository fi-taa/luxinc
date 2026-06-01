"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	createUserFileMessage,
	createUserTextMessage,
	createUserVoiceMessage,
	type ConciergeChatMessage,
} from "@/lib/concierge-chat-content";
import {
	mapConciergeRowToMessage,
	markConciergeMessagesRead,
	mergeConciergeMessage,
} from "@/lib/member/concierge-messages";
import { subscribeToConciergeMessages } from "@/lib/member/concierge-realtime";
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
	profileId: string;
	initialMessages: ConciergeChatMessage[];
	loadError?: string | null;
}

export function ConciergeChat({
	profileId,
	initialMessages,
	loadError,
}: ConciergeChatProps) {
	const [messages, setMessages] = useState<ConciergeChatMessage[]>(initialMessages);
	const [isSending, setIsSending] = useState(false);
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
	}, [messages, scrollToBottom]);

	useEffect(() => {
		return () => {
			collectBlobUrls(messagesRef.current).forEach((url) => {
				URL.revokeObjectURL(url);
			});
		};
	}, []);

	useEffect(() => {
		if (!profileId || loadError) {
			return;
		}

		void markConciergeMessagesRead().catch(() => undefined);
	}, [profileId, loadError]);

	useEffect(() => {
		if (!profileId) {
			return undefined;
		}

		return subscribeToConciergeMessages(profileId, (row) => {
			const incoming = mapConciergeRowToMessage(row);
			setMessages((current) => mergeConciergeMessage(current, incoming));

			if (row.sender === "concierge") {
				void markConciergeMessagesRead().catch(() => undefined);
			}
		});
	}, [profileId]);

	const persistUserMessage = useCallback(async (message: ConciergeChatMessage) => {
		setSendError(null);
		setIsSending(true);

		const optimisticMessages = [...messagesRef.current, message];
		setMessages(optimisticMessages);

		try {
			const response = await fetch("/api/member/concierge/messages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message }),
			});
			const body = (await response.json()) as {
				message?: ConciergeChatMessage;
				error?: string;
			};

			if (!response.ok) {
				throw new Error(body.error ?? "Failed to send message");
			}

			if (body.message) {
				setMessages((current) => {
					const withoutOptimistic = current.filter((item) => item.id !== message.id);
					return mergeConciergeMessage(withoutOptimistic, body.message!);
				});
			}
		} catch (e) {
			setMessages(messagesRef.current.filter((item) => item.id !== message.id));
			setSendError(e instanceof Error ? e.message : "Failed to send message");
		} finally {
			setIsSending(false);
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
				<p className="mt-1 font-sans text-xs text-luxinc-text-muted md:text-sm">
					Messages are delivered to your concierge team. Replies appear here in
					real time.
				</p>
			</header>

			<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
				{loadError ? (
					<p className="px-4 py-6 font-sans text-sm text-red-400 md:px-6">{loadError}</p>
				) : null}
				{!loadError && messages.length === 0 ? (
					<p className="px-4 py-2 font-sans text-sm text-luxinc-text-muted md:px-6">
						No messages yet. Send a note below and an advisor will respond.
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
					<div ref={messagesEndRef} className="h-px shrink-0" aria-hidden />
				</div>
				<div className="shrink-0">
					<ChatComposer
						onSendText={handleSendText}
						onSendVoice={handleSendVoice}
						onSendFile={handleSendFile}
						disabled={isSending || Boolean(loadError)}
					/>
				</div>
			</div>
		</section>
	);
}
