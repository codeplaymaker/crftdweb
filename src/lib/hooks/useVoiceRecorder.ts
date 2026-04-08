'use client';

/**
 * useVoiceRecorder — Mic recording + Whisper transcription hook
 *
 * - Tap to start recording, tap again to stop and transcribe
 * - Optional auto-stop on silence via Web Audio API
 * - Sends audio to /api/rep/train/whisper for transcription
 */

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseVoiceRecorderOptions {
  onTranscription?: (text: string) => void;
  onError?: (error: string) => void;
  /** Seconds of silence before auto-stop. Default 2.5 */
  silenceTimeout?: number;
  /** Auto-stop on silence? Default false */
  autoStopOnSilence?: boolean;
}

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  isTranscribing: boolean;
  recordingDuration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  toggleRecording: () => Promise<string | null>;
}

export function useVoiceRecorder(options: UseVoiceRecorderOptions = {}): UseVoiceRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const silenceFrameRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const stoppingRef = useRef(false);

  const silenceTimeoutSec = options.silenceTimeout ?? 2.5;
  const autoStopOnSilence = options.autoStopOnSilence ?? false;

  // Stabilise callbacks so startRecording / stopRecording don't recreate every render
  const onTranscriptionRef = useRef(options.onTranscription);
  const onErrorRef = useRef(options.onError);
  useEffect(() => { onTranscriptionRef.current = options.onTranscription; }, [options.onTranscription]);
  useEffect(() => { onErrorRef.current = options.onError; }, [options.onError]);

  const cleanupSilenceDetection = useCallback(() => {
    if (silenceFrameRef.current) { cancelAnimationFrame(silenceFrameRef.current); silenceFrameRef.current = null; }
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    if (audioContextRef.current) { audioContextRef.current.close().catch(() => {}); audioContextRef.current = null; }
  }, []);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (stoppingRef.current) return null;
    stoppingRef.current = true;

    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      stoppingRef.current = false;
      return null;
    }

    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    cleanupSilenceDetection();

    return new Promise<string | null>((resolve) => {
      const recorder = mediaRecorderRef.current!;

      recorder.onstop = async () => {
        setIsRecording(false);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        chunksRef.current = [];

        const duration = Date.now() - startTimeRef.current;
        if (duration < 500) {
          onErrorRef.current?.('Recording too short. Hold for at least a second.');
          stoppingRef.current = false;
          resolve(null);
          return;
        }

        setIsTranscribing(true);
        try {
          const ext = recorder.mimeType.includes('webm') ? 'webm' : 'mp4';
          const file = new File([blob], `recording.${ext}`, { type: recorder.mimeType });
          const formData = new FormData();
          formData.append('audio', file);

          const res = await fetch('/api/rep/train/whisper', {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Transcription failed');
          }

          const data = await res.json();
          const text = (data.text as string)?.trim() || '';

          if (!text) {
            onErrorRef.current?.('No speech detected. Try again.');
            resolve(null);
          } else {
            onTranscriptionRef.current?.(text);
            resolve(text);
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Transcription failed';
          onErrorRef.current?.(message);
          resolve(null);
        } finally {
          setIsTranscribing(false);
          stoppingRef.current = false;
        }
      };

      recorder.stop();
    });
  }, [cleanupSilenceDetection]);

  const startRecording = useCallback(async () => {
    // Prevent double recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') return;
    stoppingRef.current = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorderRef.current = recorder;
      recorder.start(100);

      startTimeRef.current = Date.now();
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 200);

      // Optional silence detection
      if (autoStopOnSilence) {
        try {
          const audioCtx = new AudioContext();
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 2048;
          source.connect(analyser);
          audioContextRef.current = audioCtx;

          const data = new Uint8Array(analyser.frequencyBinCount);
          let silenceStart: number | null = null;
          let hasSpeech = false;

          const check = () => {
            if (stoppingRef.current) return;
            analyser.getByteTimeDomainData(data);
            let sum = 0;
            for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
            const rms = Math.sqrt(sum / data.length) * 200;

            if (rms > 8) { hasSpeech = true; silenceStart = null; }
            else if (hasSpeech) {
              if (!silenceStart) silenceStart = Date.now();
              if ((Date.now() - silenceStart) / 1000 >= silenceTimeoutSec && !silenceTimerRef.current) {
                silenceTimerRef.current = setTimeout(() => {
                  if (!stoppingRef.current) stopRecording();
                }, 50);
              }
            }
            silenceFrameRef.current = requestAnimationFrame(check);
          };
          silenceFrameRef.current = requestAnimationFrame(check);
        } catch { /* silence detection unavailable */ }
      }
    } catch (err: unknown) {
      const name = err instanceof Error ? (err as { name?: string }).name : '';
      onErrorRef.current?.(
        name === 'NotAllowedError'
          ? 'Microphone access denied. Please allow mic access in your browser settings.'
          : 'Could not access microphone.'
      );
    }
  }, [autoStopOnSilence, silenceTimeoutSec, stopRecording]);

  const toggleRecording = useCallback(async (): Promise<string | null> => {
    if (isRecording) return stopRecording();
    await startRecording();
    return null;
  }, [isRecording, startRecording, stopRecording]);

  return { isRecording, isTranscribing, recordingDuration, startRecording, stopRecording, toggleRecording };
}
