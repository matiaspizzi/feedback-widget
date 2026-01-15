import { sdk } from './core/feedback-sdk';

export const FeedbackSDK = sdk;

if (typeof window !== 'undefined') {
  (window as any).FeedbackSDK = sdk;
}