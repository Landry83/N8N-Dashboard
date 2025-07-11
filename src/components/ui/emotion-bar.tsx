"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface EmotionBarProps {
  emotion: string;
  value: number;
  color: string;
  className?: string;
}

export const EmotionBar: React.FC<EmotionBarProps> = ({ 
  emotion, 
  value, 
  color, 
  className 
}) => {
  const percentage = Math.round(value * 100);
  const barWidth = Math.max(percentage, 2); // Minimum width for visibility

  return (
    <div className={cn("flex items-center gap-2 text-xs", className)}>
      <span className="text-gray-600 dark:text-gray-400 min-w-[80px] text-right">
        {emotion}
      </span>
      <div className="flex-1 relative">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${barWidth}%`,
              backgroundColor: color
            }}
          />
        </div>
      </div>
      <span className="text-gray-500 dark:text-gray-400 min-w-[32px] text-right">
        {(value).toFixed(2)}
      </span>
    </div>
  );
};

interface EmotionAnalysisProps {
  emotions: Array<{
    emotion: string;
    value: number;
    color: string;
  }>;
  className?: string;
}

export const EmotionAnalysis: React.FC<EmotionAnalysisProps> = ({ 
  emotions, 
  className 
}) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      {emotions.map((emotion, index) => (
        <EmotionBar
          key={`${emotion.emotion}-${index}`}
          emotion={emotion.emotion}
          value={emotion.value}
          color={emotion.color}
        />
      ))}
    </div>
  );
};

// Predefined emotion colors to match the HumeAI design
export const EMOTION_COLORS = {
  Interest: '#3B82F6',      // Blue
  Calmness: '#06B6D4',     // Cyan
  Amusement: '#F59E0B',    // Amber
  Excitement: '#EF4444',   // Red
  Determination: '#F97316', // Orange
  Realization: '#8B5CF6',  // Purple
  Joy: '#10B981',          // Green
  Surprise: '#EC4899',     // Pink
  Confusion: '#6B7280',    // Gray
  Concentration: '#7C3AED', // Violet
  Contemplation: '#0891B2', // Sky
  Awkwardness: '#DC2626',  // Red-600
  Disappointment: '#9333EA', // Purple-600
  Embarrassment: '#BE185D', // Pink-700
  Sadness: '#1E40AF',      // Blue-700
  Boredom: '#374151',      // Gray-700
  Admiration: '#059669',   // Emerald-600
  Adoration: '#DB2777',    // Pink-600
  Aesthetic: '#7C2D12',    // Orange-800
  Anger: '#DC2626',        // Red-600
  Anxiety: '#7C3AED',      // Violet-600
  Craving: '#EA580C',      // Orange-600
  Desire: '#BE123C',       // Rose-700
  Distress: '#B91C1C',     // Red-700
  Ecstasy: '#DC2626',      // Red-600
  Empathic: '#059669',     // Emergreen-600
  Entrancement: '#7C3AED', // Violet-600
  Envy: '#16A34A',         // Green-600
  Fear: '#374151',         // Gray-700
  Guilt: '#6B21A8',        // Purple-800
  Hope: '#0EA5E9',         // Sky-500
  Love: '#E11D48',         // Rose-600
  Nostalgia: '#9333EA',    // Purple-600
  Pain: '#991B1B',         // Red-800
  Pride: '#F59E0B',        // Amber-500
  Relief: '#10B981',       // Emerald-500
  Romance: '#E11D48',      // Rose-600
  Satisfaction: '#059669', // Emerald-600
  Sympathy: '#3B82F6',     // Blue-500
  Triumph: '#F59E0B',      // Amber-500
} as const;

// Utility function to get emotion color
export const getEmotionColor = (emotion: string): string => {
  return EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS] || '#6B7280';
};

// Mock emotion data generator for demo purposes
export const generateMockEmotions = (messageType: 'user' | 'assistant' = 'user') => {
  const baseEmotions = messageType === 'user' 
    ? ['Interest', 'Calmness', 'Amusement', 'Determination']
    : ['Excitement', 'Interest', 'Realization', 'Joy'];
  
  return baseEmotions.map(emotion => ({
    emotion,
    value: Math.random() * 0.5 + 0.1, // Random value between 0.1 and 0.6
    color: getEmotionColor(emotion)
  }));
}; 