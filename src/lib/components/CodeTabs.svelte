<script lang="ts" module>
	export type Tab = {
		code: string;
		id: string;
		label: string;
		lang: 'bash' | 'c';
		// Optional one-line aside under the code, e.g. which platforms a
		// package manager covers.
		note?: string;
	};
</script>

<script lang="ts">
	// A dark code panel with tabs and a copy button, used for every snippet
	// on the homepage (install commands, the C API).
	//
	// Dark in both themes: it reads as "code" at a glance, and it keeps one
	// Prism palette for the whole site (see app.css).
	import Prism from '$lib/prism';
	import CopyButton from './CopyButton.svelte';

	let {
		tabs,
		selected = $bindable(tabs[0].id),
		class: className = ''
	}: { tabs: Tab[]; selected?: string; class?: string } = $props();

	// Highlighted once. The snippets are our own constants, so injecting
	// Prism's HTML is safe.
	const highlighted = $derived(
		Object.fromEntries(
			tabs.map((t) => [t.id, Prism.highlight(t.code, Prism.languages[t.lang], t.lang)])
		)
	);

	const tab = $derived(tabs.find((t) => t.id === selected) ?? tabs[0]);
</script>

<div
	class="overflow-hidden rounded-xl border border-code-border bg-code text-code-foreground shadow-2xl shadow-black/10 {className}"
>
	<div class="flex items-center justify-between gap-2 border-b border-code-border pr-1.5 pl-2">
		<!-- Scrolls sideways when there are more tabs than fit (the install
		     section on phones), rather than wrapping onto a second row. -->
		<div class="flex min-w-0 overflow-x-auto" role="tablist">
			{#each tabs as t (t.id)}
				<button
					type="button"
					role="tab"
					aria-selected={t.id === tab.id}
					onclick={() => (selected = t.id)}
					class="shrink-0 cursor-pointer border-b-2 px-3 py-2.5 font-mono text-xs whitespace-nowrap transition-colors {t.id ===
					tab.id
						? 'border-accent text-code-foreground'
						: 'border-transparent text-code-muted hover:text-code-foreground'}"
				>
					{t.label}
				</button>
			{/each}
		</div>
		<CopyButton text={tab.code} class="shrink-0 text-code-muted hover:text-code-foreground" />
	</div>

	<!-- Every tab's panel is rendered, stacked in the same grid cell, and
	     only the selected one is visible. The cell takes the height of the
	     tallest panel, so switching tabs never resizes the block -- which
	     would otherwise shift everything below it on the page. -->
	<div class="grid grid-cols-1">
		{#each tabs as t (t.id)}
			<!-- `invisible` (not `hidden`) keeps the panel in the layout, so it
			     still counts toward the height, but out of view, the
			     accessibility tree, and find-in-page. -->
			<div
				role="tabpanel"
				class="col-start-1 row-start-1 flex min-w-0 flex-col {t.id === tab.id ? '' : 'invisible'}"
			>
				<!-- eslint-disable svelte/no-at-html-tags -->
				<!-- flex-1: a shorter snippet leaves its spare room under the
				     code, so the note stays pinned to the bottom. -->
				<pre
					class="flex-1 overflow-x-auto px-5 py-4 font-mono text-[12.5px] leading-6 sm:text-[13px]"><code
						>{@html highlighted[t.id]}</code
					></pre>
				<!-- eslint-enable svelte/no-at-html-tags -->

				{#if t.note}
					<p class="border-t border-code-border px-5 py-2.5 text-xs text-code-muted">{t.note}</p>
				{/if}
			</div>
		{/each}
	</div>
</div>
