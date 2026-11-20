# Into Science Grade 6

Interactive 3D science lab, glossary and practice tests (React + Vite + Three.js).

## Run locally

Needs Node.js 20+ (or Bun).

```
npm install
npm run dev
```

Open http://localhost:3000

## Build

```
npm run build
```

Output goes to `dist/`.

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New → Project → Import** the repository.
3. Vercel detects **Vite** automatically (Build Command `vite build`, Output Directory `dist`). Keep the defaults and click **Deploy**.

No environment variables are needed.
