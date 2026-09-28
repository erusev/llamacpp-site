<script lang="ts">
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title} · llama.cpp docs</title>
</svelte:head>

<!-- Typography for the Markdown. Code blocks are dark like the homepage's
     panels, and share its Prism palette (app.css). -->
<article
	class="prose max-w-none prose-neutral dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:decoration-foreground/30 prose-a:underline-offset-4 hover:prose-a:decoration-foreground prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-xl prose-pre:border prose-pre:border-code-border prose-pre:bg-code prose-pre:text-[13px] prose-pre:text-code-foreground prose-img:rounded-xl prose-img:border [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:text-[0.85em]"
>
	<data.component />
</article>

<nav class="mt-16 grid grid-cols-2 gap-4 border-t pt-8 text-sm">
	{#if data.prev}
		<a
			href={resolve('/docs/[slug]', { slug: data.prev.slug })}
			class="flex flex-col gap-1 rounded-lg border p-4 transition-colors hover:border-foreground/30"
		>
			<span class="flex items-center gap-1 text-muted-foreground"
				><ArrowLeft class="size-3.5" /> Previous</span
			>
			<span class="font-medium">{data.prev.title}</span>
		</a>
	{:else}
		<span></span>
	{/if}
	{#if data.next}
		<a
			href={resolve('/docs/[slug]', { slug: data.next.slug })}
			class="flex flex-col items-end gap-1 rounded-lg border p-4 transition-colors hover:border-foreground/30"
		>
			<span class="flex items-center gap-1 text-muted-foreground"
				>Next <ArrowRight class="size-3.5" /></span
			>
			<span class="font-medium">{data.next.title}</span>
		</a>
	{/if}
</nav>
