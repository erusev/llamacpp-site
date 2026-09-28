import { error } from '@sveltejs/kit';
import { loadPage, PAGES } from '$lib/docs';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => PAGES.map(({ slug }) => ({ slug }));

export const load: PageLoad = async ({ params }) => {
	const mod = await loadPage(params.slug);
	const index = PAGES.findIndex((p) => p.slug === params.slug);

	if (!mod || index === -1) {
		error(404, 'Not found');
	}

	return {
		component: mod.default,
		next: PAGES[index + 1],
		prev: PAGES[index - 1],
		title: PAGES[index].title
	};
};
