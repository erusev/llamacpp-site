// Links and facts shared across the site. Anything that goes stale (the
// stats) says where it came from, so it can be refreshed.

export const GITHUB_URL = 'https://github.com/ggml-org/llama.cpp';
export const GITHUB_API_URL = 'https://api.github.com/repos/ggml-org/llama.cpp';
export const RELEASES_URL = `${GITHUB_URL}/releases`;
export const DISCUSSIONS_URL = `${GITHUB_URL}/discussions`;
export const GGML_URL = 'https://github.com/ggml-org/ggml';
export const GGUF_MODELS_URL = 'https://huggingface.co/models?library=gguf&sort=trending';

// The desktop app. The whole point of this site is to leave "I just want to
// use local AI" to llama.app, so every page gives those visitors a way there.
export const APP_URL = 'https://llama.app';

// Docs that aren't ported to this site yet live in the repo.
export const repoDoc = (path: string) => `${GITHUB_URL}/blob/master/${path}`;

// The install scripts are still hosted on llama.app. If this site is
// adopted, they should move here (llamacpp.org/install.sh), so the engine's
// install doesn't route through the app's domain.
export const INSTALL_SH = 'curl -LsSf https://llama.app/install.sh | sh';
export const INSTALL_PS1 = 'irm https://llama.app/install.ps1 | iex';

// Formats a star count the way the header and stats show it (e.g. "129K").
export const formatStars = (n: number) =>
	new Intl.NumberFormat('en', { maximumFractionDigits: 1, notation: 'compact' }).format(n);

// As of 2026-09-28. Stars and forks from `gh api repos/ggml-org/llama.cpp`;
// commits and contributors from a local clone (`git rev-list --count HEAD`,
// `git shortlog -sn HEAD | wc -l` -- the latter counts distinct author
// names, so it's rounded down to allow for duplicates). The stars value is only a
// fallback: the homepage replaces it with the count fetched at build time
// (routes/+layout.server.ts).
export const STATS = [
	{ label: 'GitHub stars', value: '129K' },
	{ label: 'Forks', value: '23K' },
	{ label: 'Commits', value: '11K+' },
	{ label: 'Contributors', value: '1,900+' }
];
