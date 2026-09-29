<script lang="ts">
	// The site header. The right-hand link to llama.app is the one piece of
	// chrome that isn't about the engine: it's there on every page so that
	// anyone who landed here looking for "the llama app" is one click from
	// it, and so the split between the two sites is visible at a glance.
	import { ArrowUpRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { APP_URL, GITHUB_URL, formatStars } from '$lib/site';
	import Logo from './Logo.svelte';

	const inDocs = $derived(page.url.pathname.startsWith('/docs'));

	// Fetched at build time in +layout.server.ts; null if that failed.
	const stars = $derived(page.data.stars as number | null);
</script>

<!-- No border, and constrained to the content width, as on llama.app.
     `w-full` is needed because the layout is a flex column, where `mx-auto`
     alone would shrink the header to fit its contents. -->
<header class="mx-auto w-full max-w-6xl px-6 md:px-12">
	<div class="flex h-14 items-center gap-6">
		<a href={resolve('/')} aria-label="llama.cpp home"><Logo /></a>

		<nav class="flex items-center gap-5 text-sm text-muted-foreground">
			<a
				href={resolve('/docs/[slug]', { slug: 'introduction' })}
				class="transition-colors hover:text-foreground {inDocs ? 'text-foreground' : ''}">Docs</a
			>
		</nav>

		<div class="ml-auto flex items-center gap-5">
			<a
				href={APP_URL}
				class="hidden items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground md:flex"
			>
				Looking for the desktop app? <span class="font-medium text-foreground">llama.app</span>
				<ArrowUpRight class="size-3.5" />
			</a>
			<!-- "GitHub" plus the star count, as on llama.app. The count is
			     hidden when the build couldn't fetch it. -->
			<a
				href={GITHUB_URL}
				target="_blank"
				rel="noreferrer"
				class="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				GitHub
				{#if stars !== null}
					<span
						class="inline-flex items-center gap-1 rounded-md bg-foreground/8 px-1.5 py-0.5 text-xs text-foreground/70"
					>
						<span aria-hidden="true">★</span>
						{formatStars(stars)}
					</span>
				{/if}
			</a>
		</div>
	</div>
</header>
