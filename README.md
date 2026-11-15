# Your site

A Salespoint site — App Router conventions (`app/page.tsx`, an optional `app/layout.tsx`,
`metadata`), Tailwind, and no Next dependency. It runs on `@estoreclub/server`.

```
npm install
cp .env.example .env.local   # set COMPANY_API_KEY + NEXT_PUBLIC_SERVER_URL
npm run dev                  # local dev server with live reload
npm run build                # prerender to a static site in ./out
```

- Read your data in a **server** component with `@estoreclub/api` (it holds the key).
- In a `"use client"` component, reach the server through `@estoreclub/client` — it calls the
  platform RPC endpoint, so no key ever reaches the browser.
- Links are plain `<a>`; styling is Tailwind (`@import "tailwindcss"` in `app/globals.css`, with a
  `@theme` block for your brand colours).
