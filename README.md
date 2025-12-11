# Agentic YouTube Upload Assistant

Fully automated Next.js application that ingests a creator’s video file or hosted link, generates optimized YouTube metadata, and pushes the upload via the YouTube Data API.

## 🚀 Quickstart

```bash
npm install
cp .env.example .env.local
# Populate Google OAuth + refresh token in .env.local
npm run dev
```

Open `http://localhost:3000` and supply the video asset or link together with category, language, monetization preference, and optional schedule.

## 🔐 Required environment

| Variable | Description |
| --- | --- |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 client ID with YouTube Data API access |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret |
| `GOOGLE_REFRESH_TOKEN` | Refresh token with `https://www.googleapis.com/auth/youtube.upload` scope |
| `GOOGLE_REDIRECT_URI` | OAuth redirect URI used when obtaining the refresh token |

## 🧠 Feature highlights

- SEO-driven metadata (title, description, tags, hashtags, thumbnail prompt) tuned per category
- Automated YouTube uploads with public or scheduled publishing
- Language-aware tagging and monetization notes
- Clean summary UI showing all generated assets and final video link

## 🧪 Scripts

- `npm run dev` – start local development
- `npm run build` – build for production
- `npm start` – run production server
- `npm run lint` – lint the project
- `npm run typecheck` – ensure TypeScript correctness

## 📦 Deployment

The project is ready for Vercel deployment. Ensure production environment variables match the local configuration, then run:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-90245a31
```

After deployment, verify using:

```bash
curl https://agentic-90245a31.vercel.app
```
