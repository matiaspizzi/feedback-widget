import type { SDKConfig, FeedbackPayload } from '@repo/shared';
import { v4 as uuidv4 } from 'uuid';

export class FeedbackSDK {
  private static instance: FeedbackSDK;
  private config: SDKConfig | null = null;
  private userId: string;
  private lastSubmission: number = 0;

  private constructor() {
    this.userId = this.getOrCreateUserId();
  }

  private log(message: string, data?: any) {
    if (this.config?.debug) {
      console.log(`[FeedbackSDK] ${message}`, data || '');
    }
  }

  private error(message: string, error?: any) {
    console.error(`[FeedbackSDK Error] ${message}`, error || '');
  }

  private getOrCreateUserId(): string {
    if (typeof window === 'undefined') return '';

    let id = localStorage.getItem('fb_sdk_user_id');
    if (!id) {
      id = uuidv4();
      this.log('Generated new user ID', id);
      localStorage.setItem('fb_sdk_user_id', id);
    }
    return id;
  }


  /**
   * Initialize the SDK with the given configuration.
   * @param config The configuration object.
   * @param config.projectId The project ID.
   * @param config.apiKey The API key.
   * @param config.apiUrl The API URL.
   * @param config.debug Boolean, enable debug mode.
   * 
   * @example
   * ```typescript
   * FeedbackSDK.init({
   *   projectId: 'demo-project-id',
   *   apiKey: 'demo-api-key',
   *   apiUrl: 'http://localhost:3000',
   *   debug: true
   * });
   * ```
   */
  public init(config: SDKConfig): void {
    this.config = config;

    this.log('Initializing with config', config);

    if (typeof window !== 'undefined' && !document.querySelector('feedback-widget')) {
      const widget = document.createElement('feedback-widget');
      document.body.appendChild(widget);
    }
  }

  /**
   * Destroy the SDK instance. 
   * @example
   * ```typescript
   * FeedbackSDK.destroy();
   * ```
   */
  public destroy(): void {
    const existing = document.querySelector('feedback-widget');
    if (existing) existing.remove();
    this.log('Destroying SDK instance');
    this.config = null;
  }

  public static getInstance(): FeedbackSDK {
    if (!FeedbackSDK.instance) {
      FeedbackSDK.instance = new FeedbackSDK();
    }
    return FeedbackSDK.instance;
  }


  /**
   * Submit feedback to the server.
   * @param rating The rating, must be between 1 and 5.
   * @param comment The optional comment.
   * 
   * @example
   * ```typescript
   * FeedbackSDK.submitFeedback(5, 'Great app!');
   * ```
   */
  public async submitFeedback(rating: number, comment?: string): Promise<void> {
    if (!this.config) throw new Error("SDK not initialized. Call init() first.");

    const now = Date.now();
    if (now - this.lastSubmission < 5000) {
      this.log("Please wait before sending more feedback.");
      throw new Error("Please wait before sending more feedback.");
    }

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
          'x-api-key': this.config.apiKey
        },
        body: JSON.stringify(payload),
      });

      this.log('Response: ', {response, data: await response.json()});

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      this.lastSubmission = Date.now();
    } catch (error) {
      this.error('Feedback submission failed', error);
      throw error;
    }
  }
}

export const sdk = FeedbackSDK.getInstance();