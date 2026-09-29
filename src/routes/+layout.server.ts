import { GITHUB_API_URL } from '$lib/site';
import type { LayoutServerLoad } from './$types';

// The GitHub star count, shown in the header and the homepage stats. Fetched
// at build time (every page is prerendered), so it's as fresh as the last
// deploy -- same approach as llama.app. On failure it's null: the header
// then shows no count, and the stats fall back to the value in site.ts.
export const load: LayoutServerLoad = async ({ fetch }) => {
	let stars: number | null = null;

	try {
		const res = await fetch(GITHUB_API_URL);

		if (res.ok) {
			const json = (await res.json()) as { stargazers_count?: number };

			if (typeof json.stargazers_count === 'number') {
				stars = json.stargazers_count;
			}
		}
	} catch {
		// keep null on failure
	}

	return { stars };
};
