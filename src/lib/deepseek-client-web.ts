// Client-side DeepSeek client that makes API calls to the server endpoint
export class DeepSeekWebClient {
  private apiEndpoint = '/api/ai/deepseek';

  async chatCompletion(messages: Array<{ role: string; content: string }>) {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'chatCompletion',
          data: { messages }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { result } = await response.json();
      return result;
    } catch (error) {
      console.error('DeepSeek web client error:', error);
      throw error;
    }
  }

  async translateToWorkflowCommand(userInput: string): Promise<string> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'translateToWorkflowCommand',
          data: { userInput }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { result } = await response.json();
      return result;
    } catch (error) {
      console.error('DeepSeek web client error:', error);
      throw error;
    }
  }

  async generateJarvisResponse(context: string, userMessage: string): Promise<string> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generateJarvisResponse',
          data: { context, userMessage }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { result } = await response.json();
      return result;
    } catch (error) {
      console.error('DeepSeek web client error:', error);
      throw error;
    }
  }
}

// Create singleton instance for client-side use
export const createDeepSeekWebClient = (): DeepSeekWebClient => {
  return new DeepSeekWebClient();
}; 