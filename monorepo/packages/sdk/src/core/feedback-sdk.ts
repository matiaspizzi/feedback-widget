import type { SDKConfig, FeedbackPayload } from '@repo/shared';
import { v4 as uuidv4 } from 'uuid';

export class FeedbackSDK {
  private static instance: FeedbackSDK;
  private config: SDKConfig | null = null;
  private userId: string;

  private constructor() {
    this.userId = this.getOrCreateUserId();
  }

  public static getInstance(): FeedbackSDK {
    if (!FeedbackSDK.instance) {
      FeedbackSDK.instance = new FeedbackSDK();
    }
    return FeedbackSDK.instance;
  }

  private getOrCreateUserId(): string {
    if (typeof window === 'undefined') return '';

    let id = localStorage.getItem('fb_sdk_user_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('fb_sdk_user_id', id);
    }
    return id;
  }

  public init(config: SDKConfig): void {
    this.config = config;
    if (this.config.debug) console.log('Feedback SDK Initialized', config);
  }

  public async submitFeedback(rating: number, comment?: string): Promise<void> {
    if (!this.config) throw new Error("SDK not initialized. Call init() first.");

    const payload: FeedbackPayload = {
      projectId: this.config.projectId,
      userId: this.userId,
      rating,
      comment,
      timestamp: new Date().toISOString(),
      context: {
        userAgent: navigator.userAgent,
        url: window.location.href,
      }
    };

    try {
      const response = await fetch(`${this.config.apiUrl}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
    } catch (error) {
      console.error('Feedback submission failed:', error);
      throw error;
    }
  }
}

export const sdk = FeedbackSDK.getInstance();