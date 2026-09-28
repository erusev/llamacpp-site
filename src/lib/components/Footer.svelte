<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		APP_URL,
		DISCUSSIONS_URL,
		GGML_URL,
		GGUF_MODELS_URL,
		GITHUB_URL,
		RELEASES_URL,
		repoDoc
	} from '$lib/site';
	import Logo from './Logo.svelte';

	// Link columns. Internal links are resolved at render time.
	const COLUMNS = [
		{
			links: [
				{ href: resolve('/docs/[slug]', { slug: 'quickstart' }), label: 'Quickstart' },
				{ href: resolve('/docs/[slug]', { slug: 'serve' }), label: 'Server' },
				{ href: resolve('/docs/[slug]', { slug: 'api' }), label: 'API reference' },
				{ href: repoDoc('docs/build.md'), label: 'Build from source' }
			],
			title: 'Docs'
		},
		{
			links: [
				{ href: GITHUB_URL, label: 'GitHub' },
				{ href: RELEASES_URL, label: 'Releases' },
				{ href: DISCUSSIONS_URL, label: 'Discussions' },
				{ href: repoDoc('CONTRIBUTING.md'), label: 'Contributing' }
			],
			title: 'Project'
		},
		{
			links: [
				{ href: GGML_URL, label: 'ggml' },
				{ href: GGUF_MODELS_URL, label: 'GGUF models' },
				{ href: APP_URL, label: 'Llama desktop app' }
			],
			title: 'Ecosystem'
		}
	];
</script>

<footer class="border-t">
	<div class="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-4 py-14 sm:px-6 md:grid-cols-5">
		<div class="col-span-2 flex flex-col gap-3">
			<Logo />
			<p class="max-w-xs text-sm leading-relaxed text-muted-foreground">
				LLM inference in C/C++. Open source under the MIT license, built on
				<a href={GGML_URL} class="underline underline-offset-4 hover:text-foreground">ggml</a>.
			</p>
		</div>
		{#each COLUMNS as col (col.title)}
			<div class="flex flex-col gap-3 text-sm">
				<p class="font-medium">{col.title}</p>
				{#each col.links as l (l.label)}
					<a href={l.href} class="text-muted-foreground transition-colors hover:text-foreground"
						>{l.label}</a
					>
				{/each}
			</div>
		{/each}
	</div>
</footer>
