import { sdk } from "./core/feedback-sdk";
import "./ui/widget";

const FeedbackSDK = {
  init: sdk.init.bind(sdk),
  submit: sdk.submitFeedback.bind(sdk),
  destroy: sdk.destroy.bind(sdk),
};

export { FeedbackSDK };

if (typeof window !== "undefined") {
  (window as any).FeedbackSDK = FeedbackSDK;
}
