"use client"

import { useState, useRef, useCallback, useEffect } from 'react';
import { getHumeClient } from '@/lib/hume-client';

interface VoiceRecorderConfig {
  onTranscript?: (transcript: string) => void;
  onEmotions?: (emotions: Array<{ emotion: string; value: number; color: string }>) => void;
  onError?: (error: string) => void;
  autoStop?: number; // Auto stop after X seconds
}

interface VoiceRecorderState {
  isRecording: boolean;
  isProcessing: boolean;
  audioStream: MediaStream | null;
  transcript: string;
  emotions: Array<{ emotion: string; value: number; color: string }>;
  error: string | null;
  audioLevel: number;
}

export const useVoiceRecorder = (config: VoiceRecorderConfig = {}) => {
  const [state, setState] = useState<VoiceRecorderState>({
    isRecording: false,
    isProcessing: false,
    audioStream: null,
    transcript: '',
    emotions: [],
    error: null,
    audioLevel: 0
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const autoStopTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const humeClientRef = useRef(getHumeClient());

  // Monitor audio levels for visualization
  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const normalizedLevel = average / 255;
    
    setState(prev => ({ ...prev, audioLevel: normalizedLevel }));
    
    if (state.isRecording) {
      animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
    }
  }, [state.isRecording]);

  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null, isProcessing: true }));

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      streamRef.current = stream;

      // Set up audio analysis
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Set up MediaRecorder for audio capture
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioBlob(audioBlob);
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      
      setState(prev => ({
        ...prev,
        isRecording: true,
        isProcessing: false,
        audioStream: stream,
        transcript: '',
        emotions: []
      }));

      // Start audio level monitoring
      monitorAudioLevel();

      // Set auto-stop timer if configured
      if (config.autoStop) {
        autoStopTimeoutRef.current = setTimeout(() => {
          stopRecording();
        }, config.autoStop * 1000);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start recording';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isRecording: false, 
        isProcessing: false 
      }));
      config.onError?.(errorMessage);
    }
  }, [config, monitorAudioLevel]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
    }

    // Clean up audio monitoring
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Clean up auto-stop timer
    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current);
    }

    // Stop audio stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setState(prev => ({
      ...prev,
      isRecording: false,
      isProcessing: true,
      audioStream: null,
      audioLevel: 0
    }));
  }, [state.isRecording]);

  const processAudioBlob = async (audioBlob: Blob) => {
    try {
      setState(prev => ({ ...prev, isProcessing: true }));

      // Use Hume AI for emotion analysis
      const result = await humeClientRef.current.analyzeAudioBlob(audioBlob);
      
      setState(prev => ({
        ...prev,
        transcript: result.transcript || 'Audio processed',
        emotions: result.emotions || [],
        isProcessing: false
      }));

      // Call callbacks
      if (result.transcript) {
        config.onTranscript?.(result.transcript);
      }
      if (result.emotions.length > 0) {
        config.onEmotions?.(result.emotions);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process audio';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isProcessing: false 
      }));
      config.onError?.(errorMessage);
    }
  };

  const toggleRecording = useCallback(() => {
    if (state.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [state.isRecording, startRecording, stopRecording]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      humeClientRef.current.disconnect();
    };
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    toggleRecording
  };
}; 