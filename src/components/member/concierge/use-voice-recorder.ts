"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface VoiceRecordingResult {
	audioUrl: string;
	durationSeconds: number;
}

interface UseVoiceRecorderOptions {
	onComplete: (result: VoiceRecordingResult) => void;
	onError?: (message: string) => void;
}

export function useVoiceRecorder({
	onComplete,
	onError,
}: UseVoiceRecorderOptions) {
	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const startedAtRef = useRef<number>(0);

	const stopTracks = useCallback(() => {
		streamRef.current?.getTracks().forEach((track) => track.stop());
		streamRef.current = null;
	}, []);

	useEffect(() => {
		return () => {
			if (mediaRecorderRef.current?.state === "recording") {
				mediaRecorderRef.current.stop();
			}
			stopTracks();
		};
	}, [stopTracks]);

	const stopRecording = useCallback(() => {
		if (mediaRecorderRef.current?.state === "recording") {
			mediaRecorderRef.current.stop();
		}
		setIsRecording(false);
	}, []);

	const startRecording = useCallback(async () => {
		if (isRecording) {
			stopRecording();
			return;
		}

		if (!navigator.mediaDevices?.getUserMedia) {
			onError?.("Voice recording is not supported in this browser.");
			return;
		}

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			streamRef.current = stream;
			chunksRef.current = [];
			startedAtRef.current = Date.now();

			const recorder = new MediaRecorder(stream);
			mediaRecorderRef.current = recorder;

			recorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					chunksRef.current.push(event.data);
				}
			};

			recorder.onstop = () => {
				stopTracks();
				const blob = new Blob(chunksRef.current, {
					type: recorder.mimeType || "audio/webm",
				});
				chunksRef.current = [];

				if (blob.size === 0) {
					onError?.("No audio captured. Try recording again.");
					return;
				}

				const durationSeconds = Math.max(
					1,
					Math.round((Date.now() - startedAtRef.current) / 1000),
				);
				const audioUrl = URL.createObjectURL(blob);
				onComplete({ audioUrl, durationSeconds });
			};

			recorder.start();
			setIsRecording(true);
		} catch {
			stopTracks();
			onError?.("Microphone access was denied. Enable it to send voice notes.");
		}
	}, [isRecording, onComplete, onError, stopRecording, stopTracks]);

	return {
		isRecording,
		startRecording,
		stopRecording,
	};
}
