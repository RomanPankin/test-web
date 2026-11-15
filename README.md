# Your site

An estore.club site - App Router conventions (`app/page.tsx`, an optional `app/layout.tsx`,
`metadata`), Tailwind, and no Next dependency. It runs on `@estoreclub/server`.

```
npm install
cp .env.example .env.local   # then put your key in COMPANY_API_KEY
npm run dev                  # local dev server with live reload, http://localhost:3000
npm run build                # prerender to a static site in ./out
```

`.env.local` holds three settings:

| Variable | What to put there |
| --- | --- |
| `COMPANY_API_KEY` | Your shop's API key: admin, Settings → For developers. Without it the site shows its empty state |
| `SERVER_URL` | The estore.club API. Already set to `https://estore.club` |
| `PORT` | The port `npm run dev` and `npm start` listen on. Default `3000` |

- Read your data in a **server** component with `@estoreclub/api` (it holds the key).
- In a `"use client"` component, reach the server through `@estoreclub/client` — it calls the
  platform RPC endpoint, so no key ever reaches the browser.
- Links are plain `<a>`; styling is Tailwind (`@import "tailwindcss"` in `app/globals.css`, with a
  `@theme` block for your brand colours).
