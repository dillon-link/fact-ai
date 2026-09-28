# Fact AI

A minimal Next.js app that generates a fun fact using Google's Gemini API.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Node.js 24+

## Setup

Requires Node 24.

```bash
nvm use 24
npm install
```

Add your API key to `.env.local`. Get one from [Google AI Studio](https://aistudio.google.com/app/api-keys):

```
GOOGLE_API_KEY=your_key_here
```

## Run

```bash
npm run dev
```

Open http://localhost:3000 and click the button.


## Scripts

| Command       | Description              |
| ------------- | ------------------------ |
| `npm run dev` | Start the dev server     |
| `npm run build` | Build for production   |
| `npm run start` | Start the production build |
