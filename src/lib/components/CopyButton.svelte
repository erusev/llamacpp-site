<script lang="ts">
	// A copy-to-clipboard icon button. Shows a check for two seconds after a
	// copy, which is the only feedback -- no toast library for one button.
	import { Check, Copy } from '@lucide/svelte';

	let { text, class: className = '' }: { text: string; class?: string } = $props();

	let copied = $state(false);

	async function copy() {
		await navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<button
	type="button"
	onclick={copy}
	aria-label={copied ? 'Copied' : 'Copy to clipboard'}
	class="flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors {className}"
>
	{#if copied}<Check class="size-4" />{:else}<Copy class="size-4" />{/if}
</button>
