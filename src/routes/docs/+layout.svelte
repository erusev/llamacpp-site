<script lang="ts">
	// Docs shell: a sticky sidebar on desktop, a horizontal page list on
	// phones (seven pages don't need a drawer).
	import { ArrowUpRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { TOC } from '$lib/docs';
	import { GITHUB_URL } from '$lib/site';

	let { children } = $props();

	const current = $derived(page.params.slug);
</script>

<div class="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-[13rem_1fr] md:gap-14">
	<aside class="md:sticky md:top-14 md:h-[calc(100dvh-3.5rem)] md:overflow-y-auto md:py-12">
		<nav class="flex gap-8 overflow-x-auto border-b py-4 text-sm md:flex-col md:border-0 md:py-0">
			{#each TOC as section (section.title)}
				<div class="flex shrink-0 flex-col gap-1">
					<p class="mb-1 font-mono text-xs tracking-wider text-muted-foreground uppercase">
						{section.title}
					</p>
					{#each section.pages as p (p.slug)}
						<a
							href={resolve('/docs/[slug]', { slug: p.slug })}
							aria-current={p.slug === current ? 'page' : undefined}
							class="-ml-3 rounded-md border-l-2 px-3 py-1 whitespace-nowrap transition-colors {p.slug ===
							current
								? 'border-accent font-medium text-foreground'
								: 'border-transparent text-muted-foreground hover:text-foreground'}">{p.title}</a
						>
					{/each}
				</div>
			{/each}
			<!-- Everything not yet ported lives in the repo's docs folder. -->
			<div class="flex shrink-0 flex-col gap-1">
				<p class="mb-1 font-mono text-xs tracking-wider text-muted-foreground uppercase">More</p>
				<a
					href={`${GITHUB_URL}/tree/master/docs`}
					class="-ml-3 flex items-center gap-1 border-l-2 border-transparent px-3 py-1 whitespace-nowrap text-muted-foreground hover:text-foreground"
					>Docs on GitHub <ArrowUpRight class="size-3.5" /></a
				>
			</div>
		</nav>
	</aside>

	<main class="min-w-0 pb-24 md:py-12">
		{@render children()}
	</main>
</div>
