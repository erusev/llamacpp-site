import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// The docs are plain Markdown files in src/docs, compiled to components by
	// mdsvex (which also highlights their code blocks with Prism).
	// rehype-slug gives headings ids, which the pages link to.
	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex({ extensions: ['.md'], rehypePlugins: [rehypeSlug] })],
	kit: {
		// Fully static: every page is prerendered (see +layout.ts), so the
		// site can be hosted anywhere -- e.g. Cloudflare Pages, like llama.app.
		adapter: adapter()
	}
};

export default config;
