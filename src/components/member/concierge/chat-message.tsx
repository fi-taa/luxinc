import { CheckCheck, ExternalLink, FileText, Link2 } from "lucide-react";
import Image from "next/image";
import {
	conciergeAssistant,
	type ConciergeChatMessage,
} from "@/lib/concierge-chat-content";
import { resolveStorageImageUrlOrFallback } from "@/lib/supabase/storage-url";
import { useAppSelector } from "@/store/hooks";
import { selectAuth } from "@/store/slices/auth-slice";
import { cn } from "@/lib/utils";
import { VoiceMessagePlayer } from "./voice-message-player";

interface ChatMessageProps {
	message: ConciergeChatMessage;
}

function ConciergeAvatar() {
	return (
		<div
			className="flex size-9 shrink-0 items-center justify-center rounded-full bg-luxinc-gold font-sans text-xs font-semibold text-luxinc-bg"
			aria-hidden
		>
			{conciergeAssistant.initials}
		</div>
	);
}

function UserAvatar() {
	const { profile } = useAppSelector(selectAuth);
	const avatarSrc = resolveStorageImageUrlOrFallback(profile?.avatar_url);

	return (
		<div className="relative size-9 shrink-0 overflow-hidden rounded-full ring-2 ring-luxinc-gold ring-offset-1 ring-offset-luxinc-bg">
			<Image
				src={avatarSrc}
				alt=""
				fill
				className="object-cover"
				sizes="36px"
				unoptimized={avatarSrc.startsWith("blob:")}
			/>
		</div>
	);
}

function MessageMeta({
	timestamp,
	read,
	isUser,
}: {
	timestamp: string;
	read?: boolean;
	isUser: boolean;
}) {
	return (
		<div
			className={cn(
				"mt-1.5 flex items-center gap-1",
				isUser ? "justify-end" : "justify-start",
			)}
		>
			<span className="font-sans text-[11px] text-luxinc-text-muted">
				{timestamp}
			</span>
			{isUser && read ? (
				<CheckCheck className="size-3.5 text-luxinc-text" aria-label="Read" />
			) : null}
		</div>
	);
}

function FileMessage({ message }: { message: ConciergeChatMessage }) {
	const isImage = message.fileMimeType?.startsWith("image/");

	if (isImage && message.fileUrl?.trim()) {
		return (
			<figure className="max-w-xs">
				<Image
					src={message.fileUrl}
					alt={message.fileName ?? "Uploaded image"}
					width={320}
					height={208}
					unoptimized
					className="max-h-52 w-auto rounded-md object-cover"
				/>
				{message.fileName ? (
					<figcaption className="mt-2 font-sans text-xs text-luxinc-bg/80">
						{message.fileName}
					</figcaption>
				) : null}
			</figure>
		);
	}

	return (
		<a
			href={message.fileUrl}
			download={message.fileName}
			className="flex max-w-xs items-center gap-3 rounded-md bg-luxinc-bg/15 p-2 transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-bg"
		>
			<div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-luxinc-bg/20">
				<FileText className="size-5 text-luxinc-bg" aria-hidden />
			</div>
			<span className="min-w-0 truncate font-sans text-sm font-medium text-luxinc-bg">
				{message.fileName ?? "Attachment"}
			</span>
		</a>
	);
}

function LinkMessage({ message }: { message: ConciergeChatMessage }) {
	return (
		<a
			href={message.linkUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="block max-w-sm transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-bg"
		>
			<div className="flex items-start gap-3">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-luxinc-bg/20">
					<Link2 className="size-5 text-luxinc-bg" aria-hidden />
				</div>
				<div className="min-w-0">
					<p className="font-sans text-sm font-semibold text-luxinc-bg">
						{message.linkTitle}
					</p>
					<p className="mt-1 font-sans text-xs leading-relaxed text-luxinc-bg/85">
						{message.linkDescription}
					</p>
					<p className="mt-2 flex items-center gap-1 font-sans text-xs text-luxinc-bg/75 underline-offset-2 hover:underline">
						<ExternalLink className="size-3 shrink-0" aria-hidden />
						{message.linkUrl}
					</p>
				</div>
			</div>
		</a>
	);
}

function MessageBody({ message }: { message: ConciergeChatMessage }) {
	if (message.type === "voice") {
		return <VoiceMessagePlayer message={message} />;
	}
	if (message.type === "file") {
		return <FileMessage message={message} />;
	}
	if (message.type === "link") {
		return <LinkMessage message={message} />;
	}
	return (
		<p className="font-sans text-sm leading-relaxed text-luxinc-text">
			{message.text}
		</p>
	);
}

export function ChatMessage({ message }: ChatMessageProps) {
	const isUser = message.sender === "user";

	return (
		<div
			className={cn(
				"flex gap-3",
				isUser ? "flex-row-reverse" : "flex-row",
			)}
		>
			{isUser ? <UserAvatar /> : <ConciergeAvatar />}
			<div
				className={cn(
					"flex max-w-[85%] flex-col sm:max-w-[75%]",
					isUser ? "items-end" : "items-start",
				)}
			>
				<div
					className={cn(
						"rounded-2xl px-4 py-3",
						isUser
							? "rounded-tr-sm bg-luxinc-gold text-luxinc-bg"
							: "rounded-tl-sm bg-[#1A1A1A] text-luxinc-text",
						message.type === "file" && isUser && "p-2",
						message.type === "text" && isUser && "text-luxinc-bg",
						message.type === "text" &&
							!isUser &&
							"text-luxinc-text",
					)}
				>
					{message.type === "text" && isUser ? (
						<p className="font-sans text-sm leading-relaxed text-luxinc-bg">
							{message.text}
						</p>
					) : (
						<MessageBody message={message} />
					)}
				</div>
				<MessageMeta
					timestamp={message.timestamp}
					read={message.read}
					isUser={isUser}
				/>
			</div>
		</div>
	);
}
