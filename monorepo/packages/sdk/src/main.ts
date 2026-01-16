// packages/sdk/src/main.ts
import './style.css';
import { FeedbackSDK } from './index';

const DEFAULTS = {
  projectId: 'demo-project-id',
  apiKey: 'demo-api-key',
  apiUrl: 'http://localhost:3000'
};

const renderApp = () => {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  app.innerHTML = `
    <div class="config-card">
      <h1>SDK Live Config</h1>
      <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 1.5rem;">
        Los cambios se aplican automáticamente al escribir.
      </p>
      <form id="config-form">
        <div class="form-group">
          <label>Project ID</label>
          <input type="text" id="projectId" value="${DEFAULTS.projectId}" autocomplete="off">
        </div>
        <div class="form-group">
          <label>API Key</label>
          <input type="password" id="apiKey" value="${DEFAULTS.apiKey}" autocomplete="off">
        </div>
        <div class="actions">
          <button type="button" id="reset-btn" class="btn-reset" title="Reset to defaults">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 11-9-9c2.52 0 4.85.83 6.72 2.38L21 7M21 3v4h-4" />
            </svg>
            <span>Reset</span>
          </button>
        </div>
      </form>
    </div>
  `;

  setupListeners();
};

const updateSDK = () => {
  const config = {
    projectId: (document.querySelector('#projectId') as HTMLInputElement).value,
    apiKey: (document.querySelector('#apiKey') as HTMLInputElement).value,
    apiUrl: DEFAULTS.apiUrl,
    debug: true
  };

  FeedbackSDK.init(config);

  // Aseguramos que el widget esté presente en el DOM [cite: 10]
  if (!document.querySelector('feedback-widget')) {
    const widget = document.createElement('feedback-widget');
    document.body.appendChild(widget);
  }
};

const setupListeners = () => {
  const projectIdInput = document.querySelector('#projectId') as HTMLInputElement;
  const apiKeyInput = document.querySelector('#apiKey') as HTMLInputElement;
  const resetBtn = document.querySelector('#reset-btn') as HTMLButtonElement;

  // Inicialización inicial
  updateSDK();

  // Escucha de cambios en tiempo real
  [projectIdInput, apiKeyInput].forEach(input => {
    input.addEventListener('input', () => {
      updateSDK();
    });
  });

  resetBtn.addEventListener('click', () => {
    projectIdInput.value = DEFAULTS.projectId;
    apiKeyInput.value = DEFAULTS.apiKey;
    updateSDK();
  });
};

renderApp();