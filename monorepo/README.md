# Feedback Widget System

A full-stack feedback widget solution featuring a lightweight SDK (Web Component) and a Next.js backend.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- PostgreSQL Database (local or remote)

### Installation

1.  **Install dependencies:**

    ```bash
    pnpm install
    ```

2.  **Setup Database:**
    Copy `.env.example` to `packages/database/.env` and `apps/web/.env` and update `DATABASE_URL`.
    Then run migrations:

    ```bash
    pnpm db:migrate:dev
    ```

3.  **Run Development Server:**
    ```bash
    pnpm dev
    ```

    - Web App (Backend + Demo): http://localhost:3000
    - API Health Check: http://localhost:3000/api/health

## 🛠 Usage

### Using the SDK via Script Tag (CDN Simulation)

Once built, you can include the script in your HTML:

```html
<script type="module" src="http://localhost:3000/feedback-sdk.es.js"></script>
<script>
  window.onload = () => {
    FeedbackSDK.init({
      projectId: "my-project-id",
      apiKey: "my-secret-key",
      apiUrl: "http://localhost:3000",
    });
  };
</script>
<feedback-widget />
```

### Using via NPM Import

```typescript
import "@repo/sdk"; // Registers the web component
import { FeedbackSDK } from "@repo/sdk";

FeedbackSDK.init({
  projectId: "123",
  apiKey: "key",
  apiUrl: "https://api.example.com",
});

// Use <feedback-widget /> in your JSX/HTML
```

## 🧪 Testing

### API Endpoints

You can test the API using `curl` or Postman.

**Health Check:**

```bash
curl http://localhost:3000/api/health
# {"status":"ok"}
```

**Submit Feedback:**

```bash
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer FEEDBACK_API_KEY" \
  -d '{
    "projectId": "test-project",
    "userId": "user-123",
    "rating": 5,
    "comment": "Great widget!"
  }'
```

---

## 🏗 Architecture Decision Record (ADR-001)

**Status:** Accepted  
**Date:** 2026-01-15

### Context

The goal is to provide an embeddable feedback widget and an API to collect data. Key requirements include ease of integration, robust validation, and superior DX. Data persistence and user identity management are required.

### Decisions

#### 1. Monorepo with Turborepo & pnpm

**Justification:** Allows orchestration of multiple packages (SDK, API, DB) in a single repository. Facilitates sharing of types and ESLint/TS configurations, ensuring consistency and reducing code duplication (DRY).

#### 2. SDK: Vite (Library Mode) + Web Components

**Justification:** We need an agnostic and lightweight bundle that works on any web. Vite offers an optimized build. We use **Web Components with Shadow DOM** to encapsulate CSS styles, ensuring the widget is not affected by (nor affects) the host site's styles ("bulletproof style isolation").

#### 3. Backend: Next.js API Routes

**Justification:** Simplifies infrastructure by combining the backend and the demo page into a single deployable unit. Leverages Next.js server optimizations and facilitates type validation with TypeScript.

#### 4. Database: PostgreSQL + Prisma

**Justification:** Uses robust relational database storage. Prisma offers type-safety in database queries, aligning with our strict TypeScript practices. _Note: Original plan considered SQLite, but PostgreSQL was retained for robustness._

#### 5. Data Contract: Zod (Shared Package)

**Justification:** Validation schemas are defined in a shared package. This ensures that both Frontend (SDK) and Backend validate against the same source of truth, rejecting invalid payloads on both client and server.
