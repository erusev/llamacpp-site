// The docs: Markdown files in src/docs, compiled to components by mdsvex,
// and the sidebar that orders them. These are the llama.cpp docs from the
// current llama.app site, moved here unchanged apart from the Installation
// page (which pointed back at llama.app for everything but the one-liner).
import type { Component } from 'svelte';

type MdModule = { default: Component };

// The sidebar, in reading order. Each `slug` is a file in src/docs.
export const TOC = [
	{
		pages: [
			{ slug: 'introduction', title: 'Introduction' },
			{ slug: 'installation', title: 'Installation' },
			{ slug: 'quickstart', title: 'Quickstart' }
		],
		title: 'Getting started'
	},
	{
		pages: [
			{ slug: 'cli', title: 'Using the CLI' },
			{ slug: 'serve', title: 'Running a server' },
			{ slug: 'webui', title: 'Web UI' },
			{ slug: 'api', title: 'API server' }
		],
		title: 'Usage'
	}
];

export const PAGES = TOC.flatMap((section) => section.pages);

const modules = import.meta.glob<MdModule>('/src/docs/*.md');

export function loadPage(slug: string): Promise<MdModule> | undefined {
	return modules[`/src/docs/${slug}.md`]?.();
}
