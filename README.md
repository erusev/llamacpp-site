# llamacpp.org

A proposed website for the llama.cpp engine, separate from [llama.app](https://llama.app), which becomes the site for the Llama desktop apps.

Preview: https://llamacpp.pages.dev

## Why

The current llama.app site serves both the app and the engine, so it's hard to tell which one it's for. Splitting them gives each a clear audience: llama.app for people who want to use local AI, llamacpp.org for developers who want the engine -- the same split as `omlx.ai` (the app) and MLX (the engine).

## What's here

- `src/routes/+page.svelte` -- the homepage
- `src/docs` -- the llama.cpp docs, moved from the llama.app site
- `src/lib/site.ts` -- links and stats (with where each stat came from)

Every fact on the homepage comes from the llama.cpp repo; comments in the code say where.

## Open questions

- The install scripts are still served from `llama.app/install.sh` and `install.ps1` -- they should move to `llamacpp.org` if this is adopted
- The site is `noindex` (`src/app.html`, `static/robots.txt`) while it's a proposal

## Development

```sh
npm install
npm run dev
npm run deploy   # build and deploy to Cloudflare Pages (needs wrangler)
```
