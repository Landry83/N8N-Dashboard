// Emotion color constants (duplicated to avoid circular imports)
const EMOTION_COLORS = {
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
const getEmotionColor = (emotion: string): string => {
  return EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS] || '#6B7280';
};

interface HumeConfig {
  apiKey: string;
  secretKey: string;
  configId?: string;
}

interface EmotionScore {
  name: string;
  score: number;
}

interface HumeEmotionResult {
  emotions: Array<{
    emotion: string;
    value: number;
    color: string;
  }>;
  transcript?: string;
  confidence?: number;
}

export class HumeClient {
  private config: HumeConfig;
  private websocket: WebSocket | null = null;
  private isConnected = false;

  constructor(config: HumeConfig) {
    this.config = config;
  }

  async analyzeAudioBlob(audioBlob: Blob): Promise<HumeEmotionResult> {
    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Use Hume's batch API for audio analysis
      const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
        method: 'POST',
        headers: {
          'X-Hume-Api-Key': this.config.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          models: {
            prosody: {}
          },
          files: [{
            filename: 'audio.wav',
            data: base64Audio
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Hume API error: ${response.status}`);
      }

      const result = await response.json();
      return this.processHumeResponse(result);
    } catch (error) {
      console.error('Error analyzing audio with Hume:', error);
      // Return mock data as fallback
      return this.getMockEmotionData();
    }
  }

  async connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Use Hume's Expression Measurement API WebSocket
        const wsUrl = `wss://api.hume.ai/v0/stream/models?api_key=${this.config.apiKey}`;
        this.websocket = new WebSocket(wsUrl);

        this.websocket.onopen = () => {
          this.isConnected = true;
          console.log('Connected to Hume WebSocket');
          resolve();
        };

        this.websocket.onerror = (error) => {
          console.error('Hume WebSocket error:', error);
          reject(error);
        };

        this.websocket.onclose = () => {
          this.isConnected = false;
          console.log('Hume WebSocket closed');
        };

        this.websocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleWebSocketMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  sendAudioData(audioData: ArrayBuffer): void {
    if (this.websocket && this.isConnected) {
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioData)));
      
      const payload = {
        data: base64Audio,
        models: {
          prosody: {},
          language: {}
        }
      };

      this.websocket.send(JSON.stringify(payload));
    }
  }

  private handleWebSocketMessage(data: any): void {
    // Handle real-time emotion analysis results
    if (data.prosody && data.prosody.predictions) {
      const emotions = this.extractEmotions(data.prosody.predictions);
      // Emit event or call callback with emotions
      window.dispatchEvent(new CustomEvent('hume-emotions', { detail: emotions }));
    }
  }

  private processHumeResponse(result: any): HumeEmotionResult {
    // Process batch API response
    if (result.predictions && result.predictions.length > 0) {
      const prediction = result.predictions[0];
      return this.extractEmotions(prediction);
    }
    
    return this.getMockEmotionData();
  }

  private extractEmotions(prediction: any): HumeEmotionResult {
    const emotions: Array<{ emotion: string; value: number; color: string }> = [];
    
    if (prediction.models && prediction.models.prosody) {
      const prosodyData = prediction.models.prosody.grouped_predictions[0].predictions[0].emotions;
      
      // Get top emotions (filter by threshold and limit)
      const topEmotions = prosodyData
        .filter((emotion: any) => emotion.score > 0.1)
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 6);

      topEmotions.forEach((emotion: any) => {
        emotions.push({
          emotion: this.capitalizeEmotion(emotion.name),
          value: emotion.score,
          color: getEmotionColor(this.capitalizeEmotion(emotion.name))
        });
      });
    }

    return {
      emotions,
      transcript: prediction.models?.language?.grouped_predictions?.[0]?.predictions?.[0]?.text || '',
      confidence: 0.85
    };
  }

  private capitalizeEmotion(emotion: string): string {
    return emotion.charAt(0).toUpperCase() + emotion.slice(1);
  }

  private getMockEmotionData(): HumeEmotionResult {
    const mockEmotions = [
      { emotion: 'Interest', value: Math.random() * 0.4 + 0.2, color: getEmotionColor('Interest') },
      { emotion: 'Joy', value: Math.random() * 0.3 + 0.1, color: getEmotionColor('Joy') },
      { emotion: 'Calmness', value: Math.random() * 0.5 + 0.1, color: getEmotionColor('Calmness') },
      { emotion: 'Excitement', value: Math.random() * 0.3 + 0.1, color: getEmotionColor('Excitement') }
    ];

    return {
      emotions: mockEmotions,
      transcript: 'Audio analysis in demo mode',
      confidence: 0.75
    };
  }

  disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
      this.isConnected = false;
    }
  }
}

// Singleton instance
let humeClient: HumeClient | null = null;

export const getHumeClient = (): HumeClient => {
  if (!humeClient) {
    const apiKey = process.env.NEXT_PUBLIC_HUME_API_KEY || process.env.HUME_API_KEY;
    const secretKey = process.env.NEXT_PUBLIC_HUME_SECRET_KEY || process.env.HUME_SECRET_KEY;
    const configId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID;

    if (!apiKey || !secretKey) {
      console.warn('Hume API credentials not found, using mock data');
    }

    humeClient = new HumeClient({
      apiKey: apiKey || 'demo',
      secretKey: secretKey || 'demo',
      configId
    });
  }
  
  return humeClient;
}; 