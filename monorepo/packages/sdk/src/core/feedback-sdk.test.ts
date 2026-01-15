import { describe, it, expect, beforeEach } from 'vitest';
import { sdk } from './feedback-sdk';

describe('FeedbackSDK', () => {
  it('should persist userId in localStorage', () => {
    const id1 = sdk['getOrCreateUserId']();
    const id2 = sdk['getOrCreateUserId']();
    expect(id1).toBe(id2);
    expect(localStorage.getItem('fb_sdk_user_id')).toBe(id1);
  });

  it('should throw error if submitting without init', async () => {
    await expect(sdk.submitFeedback(5)).rejects.toThrow("SDK not initialized");
  });
});