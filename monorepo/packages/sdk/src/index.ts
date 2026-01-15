import { sdk } from './core/feedback-sdk';
import './ui/widget'; // Importar para registrar el Web Component

export const FeedbackSDK = sdk;

if (typeof window !== 'undefined') {
  (window as any).FeedbackSDK = sdk;
}

export * from './ui/widget';
