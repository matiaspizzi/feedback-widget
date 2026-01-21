# Feedback Widget System

A full-stack feedback widget solution featuring a lightweight SDK (Web Component) and a Next.js backend.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- PostgreSQL Database (local or remote)
- Docker & docker-compose (optional)

---

### Installation

***Before starting, copy `.env.example` to `.env` and update all variables.***

There are 2 options to start the app: Using Docker or manually running the app.

### Using Docker

1.  **Build & Run:**

    ```bash
    docker-compose up --build
    ```

2.  **Setup Database:**
    Run migrations:

    ```bash
    docker exec -it feedback-web npx prisma migrate deploy --schema=./packages/database/prisma/schema.prisma --config=./packages/database/prisma.config.ts
    ```

### Manually running the app

1.  **Install dependencies:**

    ```bash
    pnpm install
    ```

2.  **Setup Database:**
    Run migrations:

    ```bash
    pnpm db:migrate:dev
    ```

3.  **Run Development Server:**

    ```bash
    pnpm dev
    ```

---
## 🛠 Usage

Running the repo with Docker will start an nginx server at `http://localhost:8080` and a node server at `http://localhost:3000`.

The nginx server will serve the SDK files at `http://localhost:8080/feedback-sdk.umd.js` and `http://localhost:8080/feedback-sdk.es.js`.

### Using the SDK via Script Tag (CDN Simulation)

Once built, you can include the script in your HTML:

```html
<head>
  <title>CDN Test</title>
  <script src="http://localhost:8080/feedback-sdk.umd.js" defer></script>
</head>

<body>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      FeedbackSDK.init({
        projectId: 'demo-123',
        apiKey: 'fk_9812a9612879c1035f978b2cc8753891ffb514c4b472d6bb',
        apiUrl: 'http://localhost:3000',
        debug: true
      });
    });
  </script>
</body>
```

### Using the SDK via Import

```html
<head>
  <title>ESM Test</title>
</head>

<body>
  <script type="module">
    import { FeedbackSDK } from 'http://localhost:8080/feedback-sdk.es.js';

    try {
      FeedbackSDK.init({
        projectId: 'project-esm-demo',
        apiKey: 'fk_9812a9612879c1035f978b2cc8753891ffb514c4b472d6bb',
        apiUrl: 'http://localhost:3000',
        debug: true
      });
      console.log("Widget initialized successfully");
    } catch (error) {
      console.error("Failed to load feedback widget", error);
    }
  </script>
</body>
```
---
## 🧪 Testing

  **Run Tests:**

  ```bash
  pnpm test
  ```

  tip: You can use `--filter @repo/<web|sdk>` to run tests for a specific repo.

---

## 🏗 Architecture Decision Record (ADR)


### Context

The goal is to provide an embeddable feedback widget and an API to collect data. Key requirements include ease of integration, robust validation, and superior DX. Data persistence and user identity management are required.

### Decisions

#### 1. Monorepo with Turborepo & pnpm

**Justification:** Allows orchestration of multiple packages (SDK, API, DB) in a single repository. Facilitates sharing of types and ESLint/TS configurations, ensuring consistency and reducing code duplication (DRY).

#### 2. SDK: Vite (Library Mode) + Web Components

**Justification:** We need an agnostic and lightweight bundle that works on any web. Vite offers an optimized build. We use **Web Components with Shadow DOM** to encapsulate CSS styles, ensuring the widget is not affected by (nor affects) the host site's styles ("bulletproof style isolation").

#### 3. Backend: Next.js API Routes

**Justification:** Simplifies infrastructure by combining the backend and the client into a single deployable unit. Leverages Next.js server optimizations and facilitates type validation with TypeScript.


#### 4. Data Contract: Zod (Shared Package)

**Justification:** Validation schemas are defined in a shared package. This ensures that both Frontend (SDK) and Backend validate against the same source of truth, rejecting invalid payloads on both client and server.
