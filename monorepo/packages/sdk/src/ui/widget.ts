import { FeedbackSDK } from '../core/feedback-sdk';

export class FeedbackWidget extends HTMLElement {
  private shadow: ShadowRoot;
  private isOpen: boolean = false;
  private isSubmitting: boolean = false;
  private _rating: number | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  private toggleModal() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this._rating = null; // Reset rating each time it opens
      this.render(); // Re-render to reset state
      this.setupEventListeners();
    } else {
      this.render();
      this.setupEventListeners();
    }
  }

  private showError(message: string) {
    const errorEl = this.shadow.querySelector('.error-message');
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  private clearError() {
    this.showError('');
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();
    if (this.isSubmitting) return;

    this.clearError();
    const form = e.target as HTMLFormElement;
    // We can rely on internal state _rating, or get it from DOM. 
    // Let's rely on DOM to be safe and consistent with previous logic, 
    // but we use _rating for the button state.
    const ratingInput = form.querySelector('input[name="rating"]:checked') as HTMLInputElement;
    const commentInput = form.querySelector('textarea[name="comment"]') as HTMLTextAreaElement;

    if (!ratingInput) {
      this.showError('Please select a rating');
      return;
    }

    const comment = commentInput.value.trim();
    if (comment.length > 500) {
      this.showError('Comment is too long (max 500 characters)');
      return;
    }

    try {
      this.isSubmitting = true;
      this.updateSubmitButtonState();

      const rating = parseInt(ratingInput.value);
      await FeedbackSDK.getInstance().submitFeedback(rating, comment);

      // Show success state
      const container = this.shadow.querySelector('.widget-container');
      if (container) {
        const modal = container.querySelector('.modal');
        if (modal) {
          modal.innerHTML = `
                  <div class="success-message">
                      <h3 class="title">Thank you!</h3>
                      <p class="subtitle">Your feedback has been received.</p>
                      <button class="close-btn" type="button">×</button>
                  </div>
              `;
          // Re-attach close listener for the success view
          modal.querySelector('.close-btn')?.addEventListener('click', () => this.toggleModal());

          // Auto close after 2 seconds
          setTimeout(() => {
            if (this.isOpen) this.toggleModal();
          }, 2000);
        }
      }
    } catch (error) {
      console.error(error);
      this.showError('Failed to send feedback. Please try again.');
      this.isSubmitting = false;
      this.updateSubmitButtonState();
    }
  }

  // Updates the visual state of the submit button without full re-render
  private updateSubmitButtonState() {
    const btn = this.shadow.querySelector('.submit-btn') as HTMLButtonElement;
    if (!btn) return;

    if (this.isSubmitting) {
      btn.disabled = true;
      btn.textContent = 'Sending...';
    } else {
      const hasRating = this._rating !== null;
      btn.disabled = !hasRating;
      btn.textContent = 'Send Feedback';
    }
  }

  private getStyles() {
    return `
      .widget-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
      }

      .fab {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #2563eb;
        color: white;
        border: none;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
        font-size: 30px;
      }

      .fab:hover {
        transform: scale(1.05);
        background-color: #1d4ed8;
      }

      .modal {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 320px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        padding: 24px;
        display: none;
        animation: slideIn 0.2s ease-out;
      }

      .modal.open {
        display: block;
      }

      @keyframes slideIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .title {
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 8px;
        margin-top: 0;
      }

      .subtitle {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 20px;
        margin-top: 0;
      }

      .rating-group {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        flex-direction: row-reverse; /* For star logic */
      }

      /* Star Rating Logic */
      .rating-group input {
        display: none;
      }

      .rating-group label {
        cursor: pointer;
        font-size: 24px;
        color: #d1d5db;
        transition: color 0.2s;
      }

      .rating-group label:hover,
      .rating-group label:hover ~ label,
      .rating-group input:checked ~ label {
        color: #fbbf24;
      }

      textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        margin-bottom: 16px;
        resize: none;
        font-family: inherit;
        box-sizing: border-box;
      }

      textarea:focus {
        outline: none;
        border-color: #2563eb;
        ring: 2px solid #93c5fd;
      }

      .submit-btn {
        width: 100%;
        background-color: #2563eb;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .submit-btn:hover {
        background-color: #1d4ed8;
      }

      .submit-btn:disabled {
        background-color: #9ca3af;
        cursor: not-allowed;
      }

      .close-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        font-size: 20px;
      }

      .close-btn:hover {
        color: #4b5563;
      }

      .error-message {
        color: #dc2626;
        font-size: 12px;
        margin-top: 8px;
        text-align: center;
        min-height: 1.25em; /* reserve space */
      }

      .success-message {
          text-align: center;
          padding: 20px 0;
      }
    `;
  }

  private render() {
    this.shadow.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="widget-container">
        <div class="modal ${this.isOpen ? 'open' : ''}">
          <button class="close-btn" type="button">×</button>
          <h3 class="title">Your Feedback</h3>
          <p class="subtitle">Tell us what you think!</p>
          
          <form id="feedback-form">
            <div class="rating-group">
                <input type="radio" id="star5" name="rating" value="5" ${this._rating === 5 ? 'checked' : ''} /><label for="star5">★</label>
                <input type="radio" id="star4" name="rating" value="4" ${this._rating === 4 ? 'checked' : ''} /><label for="star4">★</label>
                <input type="radio" id="star3" name="rating" value="3" ${this._rating === 3 ? 'checked' : ''} /><label for="star3">★</label>
                <input type="radio" id="star2" name="rating" value="2" ${this._rating === 2 ? 'checked' : ''} /><label for="star2">★</label>
                <input type="radio" id="star1" name="rating" value="1" ${this._rating === 1 ? 'checked' : ''} /><label for="star1">★</label>
            </div>
            
            <textarea 
              name="comment" 
              rows="4" 
              placeholder="Any comments? (Optional)"
            ></textarea>

            <button type="submit" class="submit-btn" disabled>
              Send Feedback
            </button>
            <div class="error-message"></div>
          </form>
        </div>

        <button class="fab">
          ${this.isOpen ? '×' : '★'}
        </button>
      </div>
    `;
    this.updateSubmitButtonState();
  }

  private setupEventListeners() {
    const fab = this.shadow.querySelector('.fab');
    const closeBtn = this.shadow.querySelector('.close-btn');
    const form = this.shadow.querySelector('form');
    const ratingInputs = this.shadow.querySelectorAll('input[name="rating"]');
    const textarea = this.shadow.querySelector('textarea');

    fab?.addEventListener('click', () => this.toggleModal());
    closeBtn?.addEventListener('click', () => this.toggleModal());
    form?.addEventListener('submit', (e) => this.handleSubmit(e));

    ratingInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        this._rating = parseInt(target.value);
        this.updateSubmitButtonState();
        this.clearError();
      });
    });

    textarea?.addEventListener('input', () => this.clearError());
  }
}

if (!customElements.get('feedback-widget')) {
  customElements.define('feedback-widget', FeedbackWidget);
}
