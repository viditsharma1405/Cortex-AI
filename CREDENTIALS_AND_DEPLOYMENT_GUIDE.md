# CortexAI - Credentials, API Keys & Deployment Guide

This guide details all required credentials, API keys, and environment variables across CortexAI's microservices architecture, along with instructions for local development and cloud deployment.

---

## 1. Quick Credentials Inventory

| Credential / Key | Used In | Where to Obtain | Free Tier Available? | What It Powers |
|---|---|---|---|---|
| **MongoDB Connection URI** | `auth`, `chat`, `agent`, `billing` | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Yes (M0 Free Cluster) | User accounts, chat history, payments |
| **Redis URL** | `gateway`, `auth`, `agent` | Local Docker or [Upstash](https://upstash.com/) | Yes (Upstash Free Tier) | User session store, rate limits |
| **Firebase Web Config** | `frontend` | [Firebase Console](https://console.firebase.google.com/) | Yes (Generous Spark Plan) | Google OAuth login on Frontend |
| **Firebase Service Account** | `backend/services/auth` | Firebase Console -> Project Settings -> Service Accounts | Yes | Verifying Firebase ID tokens on Backend |
| **Groq API Key** | `backend/services/agent` | [Groq Console](https://console.groq.com/keys) | Yes (Free high-speed inference) | Chat agent, Search summarization, PPT & PDF generators |
| **Google Gemini API Key** | `backend/services/agent` | [Google AI Studio](https://aistudio.google.com/app/apikey) | Yes (Free rate-limited tier) | Image Analyzer, Gemini Vision, Text Embeddings |
| **OpenRouter API Key** | `backend/services/agent` | [OpenRouter](https://openrouter.ai/keys) | Pay-as-you-go / Free tier models | Coding Agent (DeepSeek Chat) |
| **Tavily API Key** | `backend/services/agent` | [Tavily AI](https://tavily.com/) | Yes (1,000 free searches/mo) | Web Search Agent |
| **AWS S3 (Keys & Bucket)** | `backend/services/agent` | [AWS Console](https://aws.amazon.com/s3/) | Yes (5 GB Free Tier for 12 mo) | Uploading and sharing generated PPT, PDF, and Images |
| **Qdrant (URL & Key)** | `backend/services/agent` | [Qdrant Cloud](https://cloud.qdrant.io/) | Yes (1 GB Free Cluster) | PDF RAG (Vector embeddings store & semantic search) |
| **Razorpay (Key & Secret)** | `frontend` & `billing` | [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys) | Yes (Test Mode is completely free) | Subscription plans & payments |

---

## 2. Environment Files Location Map

```
cortexAI/
├── frontend/
│   ├── .env               <-- Fill your Frontend keys here
│   └── .env.example
└── backend/
    ├── gateway/
    │   ├── .env           <-- Gateway ports & routing
    │   └── .env.example
    ├── services/
    │   ├── auth/
    │   │   ├── .env       <-- Auth port, MongoDB, Redis, Firebase credentials
    │   │   ├── .env.example
    │   │   └── serviceAccountKey.json (Optional if using FIREBASE_SERVICE_ACCOUNT in .env)
    │   ├── chat/
    │   │   ├── .env       <-- Chat port & MongoDB
    │   │   └── .env.example
    │   ├── agent/
    │   │   ├── .env       <-- Agent port, MongoDB, Redis, LLM keys, S3, Qdrant
    │   │   └── .env.example
    │   └── billing/
    │       ├── .env       <-- Billing port, MongoDB, Razorpay Key & Secret
    │       └── .env.example
```

---

## 3. How to Obtain Each Credential

### A. MongoDB URI
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and register or sign in.
2. Create a free shared cluster (e.g. `Cluster0`).
3. Under **Database Access**, create a user with read/write privileges.
4. Under **Network Access**, add IP `0.0.0.0/0` (allow from anywhere) or your production server's IP.
5. Click **Connect** -> **Drivers** (Node.js) and copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/cortexai?retryWrites=true&w=majority
   ```
6. Put this same URI into:
   - `backend/services/auth/.env`
   - `backend/services/chat/.env`
   - `backend/services/agent/.env`
   - `backend/services/billing/.env`

---

### B. Redis URL
- **Local:** If using Docker, run: `docker run -d -p 6379:6379 --name cortex-redis redis`
  - URL: `redis://localhost:6379`
- **Cloud / Production:** Create a free database at [Upstash Redis](https://upstash.com/):
  - Copy the connection string format: `rediss://default:<password>@<host>:<port>`
  - Put into:
    - `backend/gateway/.env`
    - `backend/services/auth/.env`
    - `backend/services/agent/.env`

---

### C. Firebase Setup (Authentication)
1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Under **Build** -> **Authentication**, enable **Google** sign-in provider.
3. **Frontend Keys:**
   - Under Project Settings -> **General**, scroll to "Your apps" -> select **Web** (`</>`).
   - Copy the configuration object into `frontend/.env`:
     ```env
     VITE_FIREBASE_API_KEY=AIzaSy...
     VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-app.firebasestorage.app
     VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
     VITE_FIREBASE_APP_ID=1:123456789:web:...
     ```
4. **Backend Admin Credentials:**
   - Under Project Settings -> **Service accounts**, click **Generate new private key**.
   - A `.json` file downloads.
   - **For local dev:** Rename it to `serviceAccountKey.json` and place it in `backend/services/auth/serviceAccountKey.json`.
   - **For cloud deployment:** Copy the entire JSON content into `backend/services/auth/.env` as:
     ```env
     FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"...","private_key":"..."}'
     ```

---

### D. LLM & AI API Keys (Agent Service)
1. **Groq**:
   - Register at [Groq Console](https://console.groq.com/).
   - Go to API Keys -> Create API Key (`gsk_...`).
   - Add to `backend/services/agent/.env` as `GROQ_API_KEY`.
2. **Google Gemini**:
   - Register at [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Click "Create API Key".
   - Add to `backend/services/agent/.env` as `GOOGLE_API_KEY`.
3. **OpenRouter**:
   - Register at [OpenRouter](https://openrouter.ai/).
   - Go to Keys -> Create Key (`sk-or-v1-...`).
   - Add to `backend/services/agent/.env` as `OPENROUTER_API_KEY`.
4. **Tavily AI**:
   - Register at [Tavily](https://tavily.com/).
   - Copy your API key (`tvly-...`).
   - Add to `backend/services/agent/.env` as `TAVILY_API_KEY`.

---

### E. AWS S3 Storage
1. Log into [AWS Console](https://aws.amazon.com/).
2. Create an S3 Bucket (e.g. `cortexai-bucket-prod`) in your desired region (e.g. `ap-south-1` or `us-east-1`).
3. Under **IAM**, create an IAM user with `AmazonS3FullAccess` permission policy.
4. Generate **Access Key** for CLI/SDK.
5. In `backend/services/agent/.env`:
   ```env
   AWS_REGION=ap-south-1
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_KEY=wJalrXUtn...
   AWS_BUCKET_NAME=cortexai-bucket-prod
   ```

---

### F. Qdrant Vector Database
1. Go to [Qdrant Cloud](https://cloud.qdrant.io/) and create an account.
2. Create a Free 1-node cluster.
3. Copy the Cluster URL (e.g. `https://xxxxxx.gcp.cloud.qdrant.io:6333`).
4. Generate an API Key under **Data Access Control** / **API Keys**.
5. In `backend/services/agent/.env`:
   ```env
   QDRANT_URL=https://xxxxxx.gcp.cloud.qdrant.io:6333
   QDRANT_API_KEY=your_qdrant_key
   ```

---

### G. Razorpay (Payments)
1. Log into [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Switch to **Test Mode** (toggle in upper right/sidebar).
3. Go to **Settings** -> **API Keys** -> **Generate Key**.
4. You will receive:
   - **Key Id** (starts with `rzp_test_...`):
     - Place in `frontend/.env` as `VITE_RAZORPAY_KEY_ID`
     - Place in `backend/services/billing/.env` as `RAZORPAY_KEY_ID`
   - **Key Secret**:
     - Place in `backend/services/billing/.env` as `RAZORPAY_KEY_SECRET`

---

## 4. Deployment Architecture & Production URL Changes

When deploying to production (e.g. Vercel for Frontend, Render/Railway/ECS for Backend services):

1. **Frontend (`frontend/.env`):**
   ```env
   VITE_SERVER_URL=https://api.yourdomain.com   # Public URL of Gateway
   ```

2. **Gateway (`backend/gateway/.env`):**
   ```env
   PORT=8000
   FRONTEND_URL=https://your-frontend.vercel.app  # For CORS & Cookies
   AUTH_SERVICE=https://auth-service-url          # Or internal docker network host
   CHAT_SERVICE=https://chat-service-url
   AGENT_SERVICE=https://agent-service-url
   BILLING_SERVICE=https://billing-service-url
   REDIS_URL=rediss://default:pwd@upstash.io:6379
   ```

3. **Production Cookies & Sessions:**
   - The Gateway has `app.set("trust proxy", 1)` enabled for HTTPS proxy handling.
   - The Auth service automatically sets `secure: true` and `sameSite: "none"` when `NODE_ENV=production`, allowing cross-origin authentication cookies between your frontend and backend domains.
