# Cortex AI

Cortex AI is a full-stack AI platform built with a React frontend and a modular Node.js backend. The project is organized around a frontend application, an API gateway, and independent backend services for authentication, chat, agents, and billing.

> **Project status:** Early development. APIs, environment variables, and service implementations may change as the platform evolves.

## Features

- React-based web application powered by Vite
- Google authentication through Firebase
- Redux Toolkit for client-side state management
- Markdown rendering and syntax highlighting for AI responses
- Monaco Editor integration for an in-browser coding experience
- Express API gateway for routing frontend requests
- Protected API routes using cookie-based authentication middleware
- Independent backend services for:
  - Authentication
  - Chat
  - AI agents
  - Billing
- Redis support for shared backend infrastructure
- Docker support for the gateway and Redis
- CORS, request logging, and service proxying through the gateway

## Architecture

```text
Cortex-AI/
├── frontend/              # React + Vite client application
├── backend/
│   ├── gateway/           # Express API gateway
│   ├── services/
│   │   ├── auth/          # Authentication service
│   │   ├── chat/          # Chat service
│   │   ├── agent/         # AI agent service
│   │   └── billing/       # Billing service
│   ├── shared/             # Shared backend code
│   ├── docker-compose.yml  # Local Redis service
│   └── package.json        # Shared backend dependencies
└── README.md
```

The frontend communicates with the backend through the gateway. The gateway exposes the following routes:

| Route | Purpose | Authentication |
| --- | --- | --- |
| `/api/auth` | Authentication operations | Public/service-dependent |
| `/api/chat` | Chat functionality | Required |
| `/api/agent` | AI agent functionality | Required |
| `/api/billing` | Billing functionality | Required |
| `/api/me` | Retrieve the current user | Required |

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- Redux Toolkit and React Redux
- Firebase Authentication
- Axios
- React Markdown with GitHub-Flavored Markdown support
- React Syntax Highlighter
- Monaco Editor
- Motion
- Lucide React and React Icons

### Backend

- Node.js
- Express
- ES modules
- Express HTTP Proxy
- Redis via ioredis
- Firebase/authentication integration
- Morgan request logging
- Docker and Docker Compose

## Prerequisites

Install the following before starting local development:

- Node.js 20 or newer
- npm
- Docker Desktop or Docker Engine with Docker Compose
- A Firebase project configured for Google sign-in

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/viditsharma1405/Cortex-AI.git
cd Cortex-AI
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

The Vite development server will print the local URL in the terminal, normally `http://localhost:5173`.

### 4. Install backend dependencies

From the repository root:

```bash
cd backend
npm install

cd gateway
npm install
```

### 5. Start Redis

From the `backend` directory:

```bash
docker compose up -d redis
```

Redis is exposed on port `6379` by default.

### 6. Configure the gateway

Create `backend/gateway/.env` with values appropriate for your local environment:

```env
PORT=8000
FRONTEND_URL=http://localhost:5173
AUTH_SERVICE=http://localhost:<auth-service-port>
CHAT_SERVICE=http://localhost:<chat-service-port>
AGENT_SERVICE=http://localhost:<agent-service-port>
BILLING_SERVICE=http://localhost:<billing-service-port>
```

The service URLs must match the ports used by the corresponding backend services. Each service may require additional environment variables; check its source and package configuration before starting it.

### 7. Start the gateway

```bash
cd backend/gateway
npm run dev
```

For a production-style start:

```bash
npm start
```

The gateway listens on the port configured by `PORT` and defaults to the container port `8000` when using the provided Dockerfile.

## Available Scripts

### Frontend

Run these commands from `frontend/`:

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

### Gateway

Run these commands from `backend/gateway/`:

```bash
npm run dev       # Start the gateway with Nodemon
npm start         # Start the gateway with Node.js
```

## Docker

The gateway includes a Dockerfile that installs backend dependencies, copies the gateway and shared code, and exposes port `8000`.

To build the gateway image from the `backend` directory:

```bash
docker build -f gateway/Dockerfile -t cortex-ai-gateway .
```

To run the image:

```bash
docker run --env-file gateway/.env -p 8000:8000 cortex-ai-gateway
```

Redis can be started independently with:

```bash
docker compose up -d redis
```

## Environment Variables

Do not commit credentials, Firebase configuration secrets, tokens, or production service URLs. Store local configuration in `.env` files and add any project-specific secret files to `.gitignore`.

The gateway currently expects:

- `PORT` — gateway listening port
- `FRONTEND_URL` — allowed frontend origin for CORS
- `AUTH_SERVICE` — authentication service base URL
- `CHAT_SERVICE` — chat service base URL
- `AGENT_SERVICE` — agent service base URL
- `BILLING_SERVICE` — billing service base URL

The frontend also requires the Firebase configuration used by `frontend/utils/firebase`. Configure those values according to your Firebase project setup.

## Development Notes

- Start Redis before running services that depend on it.
- Start the backend services before sending requests through the gateway.
- Use the gateway as the frontend API entry point rather than calling internal services directly.
- Keep service-specific environment variables close to the service that consumes them.
- Run `npm run lint` and `npm run build` in the frontend before opening a pull request.

## Contributing

1. Create a feature branch from `main`.
2. Make focused changes and add or update documentation when behavior changes.
3. Run the relevant lint, build, and service checks locally.
4. Open a pull request with a clear description of the change.

## License

No project license has been declared yet. Add a `LICENSE` file before distributing Cortex AI or accepting external contributions under defined licensing terms.
