<script lang="ts">
	// The llama.cpp lockup: the llama mark plus the wordmark in mono, with the
	// ".cpp" in the accent color -- the same lockup the current site uses.
	import logoSvg from '$lib/assets/logo.svg?raw';

	let { size = 'md' }: { size?: 'md' | 'lg' } = $props();
</script>

<span class="flex items-center {size === 'lg' ? 'gap-3' : 'gap-2'}">
	<!-- Trusted static asset, imported raw so it takes `currentColor`. -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<span class="[&_svg]:h-auto {size === 'lg' ? '[&_svg]:w-7' : '[&_svg]:w-5'}">{@html logoSvg}</span>
	<span class="font-mono font-semibold tracking-tight {size === 'lg' ? 'text-xl' : 'text-[15px]'}"
		>llama<span class="text-accent">.cpp</span></span
	>
</span>
