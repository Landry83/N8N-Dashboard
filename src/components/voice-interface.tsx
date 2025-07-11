"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, Send, Bot, User, Loader2, Sparkles, Phone, PhoneOff } from "lucide-react";
import { WorkflowParser } from "@/lib/workflow-parser";
import { useToast } from "@/hooks/use-toast";
import { EmotionAnalysis, generateMockEmotions } from "@/components/ui/emotion-bar";
import { AudioVisualizer, CircularAudioVisualizer } from "@/components/ui/audio-visualizer";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { VoiceDemoStatus } from "@/components/ui/voice-demo-status";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
  executionSteps?: any[];
  emotions?: Array<{
    emotion: string;
    value: number;
    color: string;
  }>;
}

export function VoiceInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [workflowParser] = useState(() => new WorkflowParser());
  const { toast } = useToast();

  // Real voice recording with Hume AI emotion analysis
  const voiceRecorder = useVoiceRecorder({
    onTranscript: (transcript) => {
      if (transcript && transcript.trim()) {
        handleSendMessage(transcript);
      }
    },
    onEmotions: (emotions) => {
      // Update the last message with real emotions
      setMessages(prev => {
        const updated = [...prev];
        if (updated.length > 0 && updated[updated.length - 1].type === 'user') {
          updated[updated.length - 1].emotions = emotions;
        }
        return updated;
      });
    },
    onError: (error) => {
      toast({
        title: "Voice Recording Error",
        description: error,
        variant: "destructive",
      });
    },
    autoStop: 10 // Auto stop after 10 seconds
  });

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      type: 'assistant',
      content: "Hello! I'm your AI workflow assistant. I can help you manage workflows, search templates, and execute automation tasks. What would you like to do today?",
      timestamp: new Date(),
      emotions: generateMockEmotions('assistant')
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      emotions: generateMockEmotions('user')
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    try {
      const response = await workflowParser.processVoiceInput(message);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.response,
        timestamp: new Date(),
        data: response.data,
        executionSteps: response.executionSteps,
        emotions: generateMockEmotions('assistant')
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
        timestamp: new Date(),
        emotions: generateMockEmotions('assistant')
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleVoiceToggle = () => {
    if (voiceRecorder.isRecording) {
      voiceRecorder.stopRecording();
      toast({
        title: "Voice Recording",
        description: "Stopped recording, processing audio...",
      });
    } else {
      voiceRecorder.startRecording();
      toast({
        title: "Voice Recording", 
        description: "Started recording - speak now!",
      });
    }
  };

  const quickActions = [
    { label: "List Workflows", command: "Show me all my workflows" },
    { label: "AI Templates", command: "Find AI/ML workflow templates" },
    { label: "System Status", command: "Check system health" },
    { label: "Recent Executions", command: "Show recent workflow executions" }
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Assistant
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </CardTitle>
        <CardDescription>
          Chat with your AI workflow assistant. Ask questions, execute workflows, or get help.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1 h-[400px]">
          <div className="space-y-6 p-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                {/* Message bubble */}
                <div
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className="max-w-[85%] space-y-1">
                    {/* Message header */}
                    <div className={`flex items-center gap-2 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {message.type === 'user' ? 'User' : 'Assistant'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    {/* Message content */}
                    <div
                      className={`rounded-2xl p-4 ${
                        message.type === 'user'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-gray-100'
                          : 'bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      {message.executionSteps && message.executionSteps.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {message.executionSteps.map((step, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {step.name || `Step ${index + 1}`}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Emotion Analysis */}
                    {message.emotions && message.emotions.length > 0 && (
                      <div className="mt-3 p-3 bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <EmotionAnalysis emotions={message.emotions} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex gap-3 justify-start">
                <div className="max-w-[85%] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Assistant
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Processing your request...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Voice Status */}
        <VoiceDemoStatus voiceRecorder={voiceRecorder} />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSendMessage(action.command)}
              disabled={isProcessing}
              className="text-xs"
            >
              {action.label}
            </Button>
          ))}
        </div>
        
        {/* Input Area */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isProcessing}
              className="flex-1"
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isProcessing}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Voice Controls */}
          <div className="space-y-4">
            {/* Audio Visualizer */}
            <div className="flex justify-center">
              <CircularAudioVisualizer
                isRecording={voiceRecorder.isRecording}
                audioStream={voiceRecorder.audioStream}
                height={100}
                className="mx-auto"
              />
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleVoiceToggle}
                variant={voiceRecorder.isRecording ? "destructive" : "outline"}
                size="icon"
                disabled={isProcessing || voiceRecorder.isProcessing}
                className="h-12 w-12"
              >
                {voiceRecorder.isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              
              <div className="flex flex-col items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  voiceRecorder.isRecording ? 'bg-red-500 animate-pulse' : 
                  voiceRecorder.isProcessing ? 'bg-yellow-500 animate-spin' : 
                  'bg-green-500'
                }`}></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {voiceRecorder.isRecording ? 'Recording...' : 
                   voiceRecorder.isProcessing ? 'Processing...' : 
                   'Ready'}
                </span>
              </div>
              
              <Button
                onClick={() => setIsCallActive(!isCallActive)}
                variant={isCallActive ? "destructive" : "default"}
                size="icon"
                className="h-12 w-12"
              >
                {isCallActive ? <PhoneOff className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
              </Button>
            </div>

            {/* Linear Visualizer */}
            <AudioVisualizer
              isRecording={voiceRecorder.isRecording}
              audioStream={voiceRecorder.audioStream}
              height={40}
              barCount={25}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
