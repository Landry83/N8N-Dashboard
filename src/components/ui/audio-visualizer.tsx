"use client"

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  isRecording: boolean;
  audioStream?: MediaStream | null;
  className?: string;
  height?: number;
  barCount?: number;
  color?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isRecording,
  audioStream,
  className,
  height = 60,
  barCount = 20,
  color = '#3B82F6'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationIdRef = useRef<number | undefined>(undefined);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isRecording && audioStream) {
      setupAudioAnalyser();
    } else {
      stopVisualization();
    }

    return () => {
      stopVisualization();
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isRecording, audioStream]);

  const setupAudioAnalyser = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas || !audioStream) return;

      // Create audio context
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
      
      // Create analyser node
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Connect microphone to analyser
      const source = context.createMediaStreamSource(audioStream);
      source.connect(analyser);

      // Start visualization
      startVisualization();
    } catch (error) {
      console.error('Error setting up audio analyser:', error);
    }
  };

  const startVisualization = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isRecording) return;

      animationIdRef.current = requestAnimationFrame(draw);
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = canvas.width / barCount;
      const maxBarHeight = canvas.height * 0.8;
      
      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const barHeight = (dataArray[dataIndex] / 255) * maxBarHeight;
        
        const x = i * barWidth;
        const y = canvas.height - barHeight;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, color + '40'); // 25% opacity
        gradient.addColorStop(0.5, color + 'AA'); // 67% opacity  
        gradient.addColorStop(1, color); // 100% opacity
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 2, barHeight);
        
        // Add glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 2;
        ctx.fillRect(x, y, barWidth - 2, barHeight);
        ctx.shadowBlur = 0;
      }
    };

    draw();
  };

  const stopVisualization = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
  };

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <canvas
        ref={canvasRef}
        width={300}
        height={height}
        className="w-full h-full"
        style={{ height: `${height}px` }}
      />
      {!isRecording && isMounted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            {Array.from({ length: barCount }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"
                style={{
                  height: `${((i % 3) + 1) * 8 + 10}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Circular audio visualizer for a more modern look
export const CircularAudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isRecording,
  audioStream,
  className,
  height = 120,
  barCount = 32,
  color = '#3B82F6'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationIdRef = useRef<number | undefined>(undefined);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isRecording && audioStream) {
      setupAudioAnalyser();
    } else {
      stopVisualization();
    }

    return () => {
      stopVisualization();
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isRecording, audioStream]);

  const setupAudioAnalyser = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas || !audioStream) return;

      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
      
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = context.createMediaStreamSource(audioStream);
      source.connect(analyser);

      startVisualization();
    } catch (error) {
      console.error('Error setting up audio analyser:', error);
    }
  };

  const startVisualization = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;

    const draw = () => {
      if (!isRecording) return;

      animationIdRef.current = requestAnimationFrame(draw);
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const barHeight = (dataArray[dataIndex] / 255) * radius * 0.5;
        
        const angle = (i / barCount) * Math.PI * 2;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);
        
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, color + '40');
        gradient.addColorStop(1, color);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    };

    draw();
  };

  const stopVisualization = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
  };

  return (
    <div className={cn("relative overflow-hidden rounded-full", className)}>
      <canvas
        ref={canvasRef}
        width={height}
        height={height}
        className="w-full h-full"
      />
      {!isRecording && isMounted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 animate-pulse" />
        </div>
      )}
    </div>
  );
}; 