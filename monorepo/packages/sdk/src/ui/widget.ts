import { sdk } from '../core/feedback-sdk';
import styles from './widget.css?inline';

export class FeedbackWidget extends HTMLElement {
  private shadow: ShadowRoot | null = null;
  private isOpen: boolean = false;
  private isSubmitting: boolean = false;
  private _rating: number | null = null;
  private isSuccess: boolean = false;

  private boundExternalClickListener: (e: MouseEvent) => void;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.boundExternalClickListener = this.handleExternalClick.bind(this);
  }

  connectedCallback() {
    if (!this.shadow) return;
    this.render();
    window.addEventListener('click', this.boundExternalClickListener);
  }

  disconnectedCallback() {
    window.removeEventListener('click', this.boundExternalClickListener);
  }

  private handleExternalClick(e: MouseEvent) {
    if (!this.isOpen) return;

    const path = e.composedPath();
    const isClickInside = path.includes(this);

    if (!isClickInside) {
      this.toggleModal();
    }
  }

  private toggleModal() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen && this.isSuccess) {
      this.isSuccess = false;
      this._rating = null;
    }
    this.render();
  }

  private showError(message: string) {
    if (!this.shadow) return;
    const errorEl = this.shadow.querySelector('.error-message');
    if (errorEl) errorEl.textContent = message;
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();
    if (this.isSubmitting) return;

    const form = e.target as HTMLFormElement;
    const ratingInput = form.querySelector('input[name="rating"]:checked') as HTMLInputElement;
    const commentInput = form.querySelector('textarea[name="comment"]') as HTMLTextAreaElement;

    if (!ratingInput) {
      this.showError('Please select a rating');
      return;
    }

    try {
      this.isSubmitting = true;
      this.updateSubmitButtonState();

      await sdk.submitFeedback(parseInt(ratingInput.value), commentInput.value.trim());

      this.isSuccess = true;
      this.isSubmitting = false;
      this.render();

      setTimeout(() => {
        if (this.isOpen) this.toggleModal();
      }, 2000);

    } catch (error) {
      this.showError('Failed to send. Try again.');
      this.isSubmitting = false;
      this.updateSubmitButtonState();
    }
  }

  private updateSubmitButtonState() {
    const btn = this.shadow?.querySelector('.submit-btn') as HTMLButtonElement;
    if (!btn) return;
    btn.disabled = this.isSubmitting || this._rating === null;
    btn.textContent = this.isSubmitting ? 'Sending...' : 'Send Feedback';
  }

  private setupEventListeners() {
    if (!this.shadow) return;
    this.shadow.querySelector('.fab')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleModal();
    });

    this.shadow.querySelector('.close-btn')?.addEventListener('click', () => this.toggleModal());

    if (!this.isSuccess) {
      this.shadow.querySelector('form')?.addEventListener('submit', (e) => this.handleSubmit(e));
      this.shadow.querySelectorAll('input[name="rating"]').forEach(input => {
        input.addEventListener('change', (e) => {
          this._rating = parseInt((e.target as HTMLInputElement).value);
          this.updateSubmitButtonState();
        });
      });
    }
  }

  private render() {
    if (!this.shadow) return;

    const content = this.isSuccess
      ? `
        <div class="success-message">
          <h3 class="title">Thank you!</h3>
          <p class="subtitle">Your feedback has been received.</p>
          <button class="close-btn" type="button">×</button>
        </div>
      `
      : `
        <button class="close-btn" type="button">×</button>
        <h3 class="title">Your Feedback</h3>
        <p class="subtitle">Tell us what you think!</p>
        <form>
          <div class="rating-group">
            ${[5, 4, 3, 2, 1].map(num => `
              <input type="radio" id="st${num}" name="rating" value="${num}" ${this._rating === num ? 'checked' : ''}>
              <label for="st${num}">★</label>
            `).join('')}
          </div>
          <textarea name="comment" rows="4" placeholder="Optional comments..."></textarea>
          <button type="submit" class="submit-btn" ${this._rating ? '' : 'disabled'}>Send Feedback</button>
          <div class="error-message"></div>
        </form>
      `;

    this.shadow.innerHTML = `
      <style>${styles}</style>
      <div class="widget-container">
        <div class="modal ${this.isOpen ? 'open' : ''}">
          ${content}
        </div>
        <button class="fab">${this.isOpen ? '×' : '★'}</button>
      </div>
    `;
    this.setupEventListeners();
  }
}

if (typeof window !== 'undefined' && !customElements.get('feedback-widget')) {
  customElements.define('feedback-widget', FeedbackWidget);
}
