<script lang="ts">
	// The site header. The right-hand link to llama.app is the one piece of
	// chrome that isn't about the engine: it's there on every page so that
	// anyone who landed here looking for "the llama app" is one click from
	// it, and so the split between the two sites is visible at a glance.
	import { ArrowUpRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { APP_URL, GGUF_MODELS_URL, GITHUB_URL } from '$lib/site';
	import GitHubIcon from './GitHubIcon.svelte';
	import Logo from './Logo.svelte';

	const inDocs = $derived(page.url.pathname.startsWith('/docs'));
</script>

<header class="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
	<div class="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
		<a href={resolve('/')} aria-label="llama.cpp home"><Logo /></a>

		<nav class="flex items-center gap-5 text-sm text-muted-foreground">
			<a
				href={resolve('/docs/[slug]', { slug: 'introduction' })}
				class="transition-colors hover:text-foreground {inDocs ? 'text-foreground' : ''}">Docs</a
			>
			<!-- External links are marked with an arrow, so it's clear they
			     leave the site. -->
			<a
				href={GGUF_MODELS_URL}
				target="_blank"
				rel="noreferrer"
				class="hidden items-center gap-0.5 transition-colors hover:text-foreground sm:flex"
			>
				Models <ArrowUpRight class="size-3.5" />
			</a>
		</nav>

		<div class="ml-auto flex items-center gap-2">
			<a
				href={APP_URL}
				class="hidden items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground md:flex"
			>
				Looking for the desktop app? <span class="font-medium text-foreground">llama.app</span>
				<ArrowUpRight class="size-3.5" />
			</a>
			<a
				href={GITHUB_URL}
				target="_blank"
				rel="noreferrer"
				aria-label="llama.cpp on GitHub"
				class="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
			>
				<GitHubIcon class="size-5" />
			</a>
		</div>
	</div>
</header>
