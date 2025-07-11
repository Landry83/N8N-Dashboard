"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Circle, Mic, Brain, BarChart3 } from 'lucide-react';

interface VoiceDemoStatusProps {
  voiceRecorder: {
    isRecording: boolean;
    isProcessing: boolean;
    audioStream: MediaStream | null;
    transcript: string;
    emotions: Array<{ emotion: string; value: number; color: string }>;
    error: string | null;
    audioLevel: number;
  };
}

export const VoiceDemoStatus: React.FC<VoiceDemoStatusProps> = ({ voiceRecorder }) => {
  const features = [
    {
      name: "Microphone Access",
      status: voiceRecorder.audioStream ? "active" : "inactive",
      icon: Mic,
      description: "Real-time audio capture"
    },
    {
      name: "Audio Visualization", 
      status: voiceRecorder.isRecording ? "active" : "ready",
      icon: BarChart3,
      description: "Live sound wave display"
    },
    {
      name: "Hume AI Analysis",
      status: voiceRecorder.isProcessing ? "processing" : 
             voiceRecorder.emotions.length > 0 ? "active" : "ready",
      icon: Brain,
      description: "Emotion analysis from voice"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "processing": return "bg-yellow-500 animate-pulse";
      case "ready": return "bg-blue-500";
      default: return "bg-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return CheckCircle;
      case "processing": return AlertCircle;
      case "ready": return Circle;
      default: return Circle;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            voiceRecorder.isRecording ? 'bg-red-500 animate-pulse' : 
            voiceRecorder.isProcessing ? 'bg-yellow-500' : 
            'bg-green-500'
          }`} />
          Voice Interface Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Feature Status */}
        <div className="space-y-2">
          {features.map((feature) => {
            const StatusIcon = getStatusIcon(feature.status);
            return (
              <div key={feature.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <feature.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{feature.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className="text-xs capitalize"
                  >
                    {feature.status}
                  </Badge>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(feature.status)}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Audio Level Indicator */}
        {voiceRecorder.isRecording && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Audio Level</span>
              <span>{Math.round(voiceRecorder.audioLevel * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                style={{ width: `${voiceRecorder.audioLevel * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Current Status */}
        <div className="text-xs text-muted-foreground">
          {voiceRecorder.error ? (
            <span className="text-red-500">Error: {voiceRecorder.error}</span>
          ) : voiceRecorder.isRecording ? (
            <span className="text-green-600">🎤 Recording audio - speak now!</span>
          ) : voiceRecorder.isProcessing ? (
            <span className="text-yellow-600">🧠 Analyzing emotions...</span>
          ) : voiceRecorder.transcript ? (
            <span className="text-blue-600">✅ Last analysis: {voiceRecorder.emotions.length} emotions detected</span>
          ) : (
            <span>Ready for voice input</span>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground p-2 bg-muted rounded-lg">
          <strong>How to use:</strong>
          <br />
          1. Click the microphone button to start recording
          <br />
          2. Speak clearly for 2-10 seconds  
          <br />
          3. Click stop or wait for auto-stop
          <br />
          4. View emotion analysis below your message
        </div>
      </CardContent>
    </Card>
  );
}; 