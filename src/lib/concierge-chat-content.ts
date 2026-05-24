export type ConciergeMessageType = "text" | "voice" | "link" | "file";

export interface ConciergeChatMessage {
	id: string;
	sender: "concierge" | "user";
	type: ConciergeMessageType;
	timestamp: string;
	read?: boolean;
	text?: string;
	voiceDuration?: string;
	voiceTotal?: string;
	voiceAudioUrl?: string;
	linkTitle?: string;
	linkDescription?: string;
	linkUrl?: string;
	fileName?: string;
	fileUrl?: string;
	fileMimeType?: string;
}

export const chatEmojis = [
	"😀",
	"😊",
	"🙏",
	"✨",
	"✈️",
	"🌍",
	"🏝️",
	"🥂",
	"🍾",
	"☀️",
	"🌅",
	"🦁",
	"🐘",
	"💎",
	"👋",
	"❤️",
	"🔥",
	"👍",
	"🎉",
	"📎",
	"📷",
	"🗺️",
	"⏰",
	"✅",
] as const;

export const maxChatFileBytes = 10 * 1024 * 1024;

export const conciergeAssistant = {
	name: "slothpilot",
	initials: "SL",
};

export const initialConciergeChatMessages: ConciergeChatMessage[] = [
	{
		id: "welcome",
		sender: "concierge",
		type: "text",
		timestamp: "10:38",
		text: "Hello! I'm your personal AI Assistant slothpilot.",
	},
	{
		id: "user-voice",
		sender: "user",
		type: "voice",
		timestamp: "10:41",
		read: true,
		voiceDuration: "02:12",
		voiceTotal: "11:25",
	},
	{
		id: "concierge-detail",
		sender: "concierge",
		type: "text",
		timestamp: "10:44",
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
	},
	{
		id: "user-link",
		sender: "user",
		type: "link",
		timestamp: "10:47",
		read: true,
		linkTitle: "External Link Title",
		linkDescription: "Brief description of the linked resource for your architect.",
		linkUrl: "https://www.externallink.com",
	},
	{
		id: "concierge-reply",
		sender: "concierge",
		type: "text",
		timestamp: "10:48",
		text: "Thank you, Daniel. I've noted this for your Travel Architect and will follow up within the hour.",
	},
];

export const voiceWaveformHeights = [
	4, 7, 5, 9, 6, 8, 4, 10, 7, 5, 8, 6, 9, 4, 7, 5, 8, 6, 10, 7, 5, 9, 6, 8,
];

const defaultConciergeReplies = [
	"Thank you for your message. I've shared this with your Travel Architect.",
	"Noted with discretion. Expect a tailored recommendation shortly.",
	"Understood. I'm aligning this with your Travel DNA preferences now.",
	"Your request is in our private queue. A concierge will confirm details soon.",
];

export function createChatMessageId(): string {
	return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatChatTimestamp(date = new Date()): string {
	return date.toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit",
	});
}

export function createUserTextMessage(text: string): ConciergeChatMessage {
	return {
		id: createChatMessageId(),
		sender: "user",
		type: "text",
		timestamp: formatChatTimestamp(),
		text: text.trim(),
		read: true,
	};
}

export function createConciergeTextMessage(text: string): ConciergeChatMessage {
	return {
		id: createChatMessageId(),
		sender: "concierge",
		type: "text",
		timestamp: formatChatTimestamp(),
		text,
	};
}

export function formatVoiceDuration(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function createUserVoiceMessage(
	audioUrl: string,
	durationSeconds: number,
): ConciergeChatMessage {
	const formatted = formatVoiceDuration(durationSeconds);
	return {
		id: createChatMessageId(),
		sender: "user",
		type: "voice",
		timestamp: formatChatTimestamp(),
		read: true,
		voiceDuration: formatted,
		voiceTotal: formatted,
		voiceAudioUrl: audioUrl,
	};
}

export function createUserFileMessage(file: File, fileUrl: string): ConciergeChatMessage {
	return {
		id: createChatMessageId(),
		sender: "user",
		type: "file",
		timestamp: formatChatTimestamp(),
		read: true,
		fileName: file.name,
		fileUrl,
		fileMimeType: file.type,
	};
}

export function getReplyContextFromMessage(message: ConciergeChatMessage): string {
	if (message.type === "text" && message.text) {
		return message.text;
	}
	if (message.type === "voice") {
		return `Voice message ${message.voiceDuration ?? ""}`.trim();
	}
	if (message.type === "file" && message.fileName) {
		return `File upload ${message.fileName}`;
	}
	if (message.type === "link" && message.linkTitle) {
		return `Link shared ${message.linkTitle}`;
	}
	return "New message";
}

export function getDummyConciergeReply(userText: string): string {
	const normalized = userText.toLowerCase();

	if (normalized.includes("voice message")) {
		return "Voice note received. I'm transcribing it privately and will respond with next steps.";
	}
	if (normalized.includes("file upload") || normalized.includes("attachment")) {
		return "Your file is secured in our vault. I've routed it to your Travel Architect for review.";
	}

	if (normalized.includes("flight") || normalized.includes("airport")) {
		return "I've flagged your flight request. Our logistics team will propose private routing options within the hour.";
	}
	if (normalized.includes("hotel") || normalized.includes("stay")) {
		return "Accommodation preferences received. I'll shortlist properties that match your Crown Collection standards.";
	}
	if (normalized.includes("dinner") || normalized.includes("restaurant")) {
		return "Reservation support is underway. I'll secure a discreet table and share confirmation shortly.";
	}
	if (normalized.includes("thank")) {
		return "Always a pleasure, Daniel. I'm here whenever you need anything else.";
	}

	const index = normalized.length % defaultConciergeReplies.length;
	return defaultConciergeReplies[index] ?? defaultConciergeReplies[0];
}

export const conciergeReplyDelayMs = { min: 700, max: 1400 };
