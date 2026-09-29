<script lang="ts">
	// The llamacpp.org homepage.
	//
	// Who it's for: developers and enthusiasts who want the engine itself --
	// to run models from the terminal, serve them, benchmark them, or build
	// them into something. People who just want to use local AI belong on
	// llama.app, and the page says so up front (the header, the hero's
	// "Prefer a desktop app?" line) and again at the end.
	//
	// Section order follows the questions an engine visitor asks, in order:
	//   1. What is this, and how do I try it?  -- hero: tagline, install, terminal
	//   2. Is it serious?                      -- stats from GitHub and the repo
	//   3. What do I get?                      -- the `llama` command's toolkit
	//   4. Can my apps use it?                 -- the server and its API
	//   5. Will it run on my hardware?         -- backends, by device
	//   6. Which models?                       -- GGUF and quantization
	//   7. Can I embed it?                     -- libllama, the C API
	//   8. How do I install it my way?         -- every install method
	//   9. I just want an app                  -- hand-off to llama.app
	//
	// Every fact on the page comes from the llama.cpp repo (README, docs,
	// tool sources) or its own docs; where it could drift, a comment says
	// where it came from.
	import {
		Activity,
		ArrowRight,
		ArrowUpRight,
		AudioLines,
		Braces,
		Gauge,
		Layers,
		ListOrdered,
		MessagesSquare,
		Monitor,
		Network,
		Wrench,
		Zap
	} from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import logoSvg from '$lib/assets/logo.svg?raw';
	import CodeTabs, { type Tab } from '$lib/components/CodeTabs.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Prism from '$lib/prism';
	import GitHubIcon from '$lib/components/GitHubIcon.svelte';
	import {
		APP_URL,
		GGUF_MODELS_URL,
		GITHUB_URL,
		INSTALL_PS1,
		INSTALL_SH,
		formatStars,
		repoDoc,
		STATS
	} from '$lib/site';

	let { data } = $props();

	const docs = (slug: string) => resolve('/docs/[slug]', { slug });

	// The stats row, with the star count fetched at build time (see
	// +layout.server.ts) in place of the one in site.ts, so it always matches
	// the header. Falls back to site.ts if the fetch failed.
	const stats = $derived(
		STATS.map((s) =>
			s.label === 'GitHub stars' && data.stars !== null
				? { ...s, value: formatStars(data.stars) }
				: s
		)
	);

	// -- Hero install --------------------------------------------------------------
	//
	// Defaults to the visitor's OS once the page is running (app.html sets
	// `data-os` before the first paint; the prerendered HTML shows the
	// macOS/Linux command, which is right for most visitors without JS).
	let heroOs = $state<'unix' | 'windows'>('unix');

	onMount(() => {
		if (document.documentElement.dataset.os === 'windows') {
			heroOs = 'windows';
			installMethod = 'script-windows';
		}
	});

	const heroCommand = $derived(heroOs === 'windows' ? INSTALL_PS1 : INSTALL_SH);

	// -- Hero terminal ---------------------------------------------------------------
	//
	// Two sessions, one per headline command. The `cli` transcript is the
	// real one from the docs' Quickstart (thinking trimmed), including its
	// speeds -- keep them in sync, or drop the speeds rather than invent
	// new ones. The `serve` tab shows commands only, no log output, so
	// there's nothing in it that can go stale.
	type Line = { kind: 'cmd' | 'input' | 'output' | 'muted'; text: string };

	const SESSIONS: { id: string; label: string; lines: Line[] }[] = [
		{
			id: 'cli',
			label: 'llama cli',
			lines: [
				{ kind: 'cmd', text: 'llama cli -hf unsloth/gemma-4-E4B-it-GGUF:Q4_K_M' },
				{ kind: 'input', text: 'hello, who are you?' },
				{
					kind: 'output',
					text: 'Hello! I am Gemma 4, an open weights large language model developed by Google DeepMind. How can I help you today?'
				},
				{ kind: 'muted', text: '[ Prompt: 113.2 t/s | Generation: 36.1 t/s ]' }
			]
		},
		{
			id: 'serve',
			label: 'llama serve',
			lines: [
				{ kind: 'cmd', text: 'llama serve -hf ggml-org/gemma-4-e4b-it-GGUF:Q4_0' },
				{ kind: 'muted', text: '# web UI and OpenAI-compatible API on http://localhost:8080' },
				{
					kind: 'cmd',
					text: `curl localhost:8080/v1/chat/completions \\\n  -d '{"messages": [{"role": "user", "content": "Hi!"}]}'`
				}
			]
		}
	];

	// Commands are highlighted like the rest of the site's shell snippets
	// (and like a shell with syntax highlighting); the output stays plain.
	const bash = (code: string) => Prism.highlight(code, Prism.languages.bash, 'bash');

	let sessionId = $state('cli');
	const session = $derived(SESSIONS.find((s) => s.id === sessionId)!);

	// -- The toolkit -------------------------------------------------------------------
	//
	// Subcommands of the unified `llama` binary, with their descriptions
	// verbatim from the command table in `app/llama.cpp`. Not all of them:
	// `update`, `version`, `licenses`, and `help` are housekeeping. Most of
	// these are hidden from plain `llama help`, so the section shows
	// `llama help all`.
	const COMMANDS = [
		{ desc: 'HTTP API server', name: 'serve' },
		{ desc: 'Command-line interactive interface', name: 'cli' },
		{ desc: 'Download a model', name: 'download' },
		{ desc: 'Text completion', name: 'completion' },
		{ desc: 'Benchmark prompt processing and text generation', name: 'bench' },
		{ desc: 'Benchmark batched decoding performance', name: 'batched-bench' },
		{ desc: 'Compute parameters to fit a model in device memory', name: 'fit-params' },
		{ desc: 'Quantize a model', name: 'quantize' },
		{ desc: 'Compute model perplexity and KL divergence', name: 'perplexity' }
	];

	// -- The server --------------------------------------------------------------------
	//
	// From the feature list at the top of `tools/server/README.md`, reworded
	// for scanning. Grouped loosely: compatibility first (the reason most
	// people reach for it), then capabilities, then operations.
	const SERVER_FEATURES = [
		{
			body: 'Chat completions, responses, and embeddings. Point any OpenAI SDK at it.',
			icon: Braces,
			title: 'OpenAI-compatible'
		},
		{
			body: 'The Messages API too, so tools built for Claude can use local models.',
			icon: MessagesSquare,
			title: 'Anthropic-compatible'
		},
		{
			body: 'A full chat interface in the browser, served from the same port.',
			icon: Monitor,
			title: 'Built-in web UI'
		},
		{
			body: 'Function calling for almost any model, plus JSON-schema and grammar-constrained output.',
			icon: Wrench,
			title: 'Tools and structured output'
		},
		{
			body: 'Images, audio, and video as input, through the same OpenAI-compatible endpoints.',
			icon: AudioLines,
			title: 'Multimodal'
		},
		{
			body: 'Parallel decoding for many users, with continuous batching.',
			icon: Layers,
			title: 'Built to serve'
		},
		{
			body: 'A small draft model, n-gram lookup, or multi-token prediction proposes tokens; the model verifies them. Same output, faster.',
			icon: Zap,
			title: 'Speculative decoding'
		},
		{
			body: 'Reranking endpoint, health checks, and Prometheus metrics.',
			icon: Activity,
			title: 'Ready for production'
		}
	];

	const API_TABS: Tab[] = [
		{
			code: `curl http://localhost:8080/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`,
			id: 'curl',
			label: 'curl',
			lang: 'bash'
		},
		{
			code: `from openai import OpenAI

client = OpenAI(base_url="http://localhost:8080/v1", api_key="none")

reply = client.chat.completions.create(
    model="gemma-4-e4b-it",
    messages=[{"role": "user", "content": "Hello!"}],
)`,
			id: 'python',
			label: 'Python',
			lang: 'python'
		},
		{
			code: `import OpenAI from "openai";

const client = new OpenAI({ baseURL: "http://localhost:8080/v1", apiKey: "none" });

const reply = await client.chat.completions.create({
  model: "gemma-4-e4b-it",
  messages: [{ role: "user", content: "Hello!" }],
});`,
			id: 'js',
			label: 'JavaScript',
			lang: 'javascript'
		}
	];

	// -- Hardware ------------------------------------------------------------------------
	//
	// The "Supported backends" table in the README, grouped by the kind of
	// device a visitor would look for, plus the CPU instruction sets from
	// its "Description" list. Mono names are what you'd pass to CMake or see
	// in logs; the second line is the hardware, in the visitor's words.
	const HARDWARE = [
		{
			backends: [
				{ device: 'Apple Silicon', name: 'Metal' },
				{ device: 'NVIDIA GPUs', name: 'CUDA' },
				{ device: 'AMD GPUs', name: 'HIP' },
				{ device: 'Any GPU', name: 'Vulkan' },
				{ device: 'Intel GPUs', name: 'SYCL' },
				{ device: 'Moore Threads GPUs', name: 'MUSA' },
				{ device: 'Adreno GPUs', name: 'OpenCL' },
				{ device: 'Browsers and native', name: 'WebGPU' }
			],
			title: 'GPUs'
		},
		{
			backends: [
				{ device: 'Apple, ARM', name: 'NEON' },
				{ device: 'x86', name: 'AVX · AVX-512 · AMX' },
				{ device: 'RISC-V', name: 'RVV' },
				{ device: 'AMD CPUs', name: 'ZenDNN' },
				{ device: 'Any CPU', name: 'BLAS · BLIS' }
			],
			title: 'CPUs'
		},
		{
			backends: [
				{ device: 'Ascend NPUs', name: 'CANN' },
				{ device: 'Snapdragon', name: 'Hexagon' },
				// Marked "In Progress" in the README's backends table
				{ device: 'Intel CPU, GPU, NPU (in progress)', name: 'OpenVINO' },
				{ device: 'IBM Z & LinuxONE', name: 'zDNN' },
				{ device: 'Across machines', name: 'RPC' }
			],
			title: 'NPUs, mainframes, and clusters'
		}
	];

	// -- Quantization ------------------------------------------------------------------------
	//
	// Llama 3 8B at each common quantization level: size and perplexity
	// increase, verbatim from the type table in
	// `tools/quantize/quantize.cpp` (its "G" is GiB -- Q8_0 at 8.5 bits per
	// weight x 8.03B params = 7.95 GiB). F16 isn't in that table for this
	// model; its size is 8.03B params x 2 bytes, and it's the baseline the
	// perplexity increases are measured against.
	const QUANTS = [
		{ name: 'F16', ppl: null, size: 14.96 },
		{ name: 'Q8_0', ppl: 0.0026, size: 7.96 },
		{ name: 'Q6_K', ppl: 0.0217, size: 6.14 },
		{ name: 'Q5_K_M', ppl: 0.0569, size: 5.33 },
		{ name: 'Q4_K_M', ppl: 0.1754, size: 4.58 },
		{ name: 'Q3_K_M', ppl: 0.6569, size: 3.74 },
		{ name: 'Q2_K', ppl: 3.5199, size: 2.96 }
	];
	const F16_SIZE = QUANTS[0].size;

	// The usual sweet spot, and the default in most GGUF repos.
	const HIGHLIGHT_QUANT = 'Q4_K_M';

	// -- The C API --------------------------------------------------------------------------
	//
	// A condensed `examples/simple/simple.cpp`, minus error handling and the
	// tokenization boilerplate. It's C++, not C: `llama.h` declares
	// `struct llama_model` etc. without typedefs, so C would need `struct`
	// on every type. `ggml_backend_load_all()` stays in because builds with
	// dynamic backends (`GGML_BACKEND_DL`) load no backend without it. Keep
	// the function names in sync with `include/llama.h`.
	const C_TABS: Tab[] = [
		{
			code: `#include "llama.h"

ggml_backend_load_all();

llama_model * model = llama_model_load_from_file(
    "model.gguf", llama_model_default_params());
llama_context * ctx = llama_init_from_model(
    model, llama_context_default_params());
const llama_vocab * vocab = llama_model_get_vocab(model);

llama_sampler * smpl = llama_sampler_chain_init(
    llama_sampler_chain_default_params());
llama_sampler_chain_add(smpl, llama_sampler_init_greedy());

// Decode the prompt, then sample one token at a time
llama_batch batch = llama_batch_get_one(tokens, n_tokens);
while (llama_decode(ctx, batch) == 0) {
    llama_token tok = llama_sampler_sample(smpl, ctx, -1);
    if (llama_vocab_is_eog(vocab, tok)) break;

    // ...print llama_token_to_piece(vocab, tok, ...)
    batch = llama_batch_get_one(&tok, 1);
}`,
			id: 'cpp',
			label: 'simple.cpp',
			// C highlighting: this snippet uses nothing C++-specific to color
			lang: 'c'
		}
	];

	const EMBED_TARGETS = [
		{ href: repoDoc('include/llama.h'), label: 'llama.h', note: 'The C API' },
		{
			href: repoDoc('docs/xcframework.md'),
			label: 'XCFramework',
			note: 'iOS, macOS, visionOS, tvOS'
		},
		{ href: repoDoc('docs/android.md'), label: 'Android', note: 'Build and run on device' },
		{ href: repoDoc('docs/docker.md'), label: 'Docker', note: 'CPU, CUDA, ROCm, and more' },
		{ href: repoDoc('gguf-py/README.md'), label: 'gguf-py', note: 'Read and write GGUF in Python' }
	];

	// -- Install -----------------------------------------------------------------------------
	//
	// From `docs/install.md` and `docs/build.md`. The platform notes are
	// what install.md's table says each one covers.
	const INSTALL_TABS: Tab[] = [
		{
			code: INSTALL_SH,
			id: 'script',
			label: 'macOS / Linux',
			lang: 'bash',
			note: 'Detects your platform and installs the latest llama binary.'
		},
		{
			code: INSTALL_PS1,
			id: 'script-windows',
			label: 'Windows',
			lang: 'bash',
			note: 'Run in PowerShell. Detects your platform and installs the latest llama binary.'
		},
		{
			code: 'brew install llama.cpp',
			id: 'brew',
			label: 'Homebrew',
			lang: 'bash',
			note: 'macOS and Linux. Updated automatically with every release.'
		},
		{
			code: 'winget install llama.cpp',
			id: 'winget',
			label: 'winget',
			lang: 'bash',
			note: 'Windows. Updated automatically with every release.'
		},
		{
			code: 'nix profile install nixpkgs#llama-cpp',
			id: 'nix',
			label: 'Nix',
			lang: 'bash',
			note: 'macOS and Linux, with flakes enabled.'
		},
		{
			code: 'conda install -c conda-forge llama.cpp',
			id: 'conda',
			label: 'conda',
			lang: 'bash',
			note: 'Windows, macOS, and Linux. Builds with CUDA, Vulkan, and Metal.'
		},
		{
			code: `docker run -p 8080:8080 -v ~/models:/models \\
  ghcr.io/ggml-org/llama.cpp:server \\
  -m /models/model.gguf --host 0.0.0.0`,
			id: 'docker',
			label: 'Docker',
			lang: 'bash',
			note: 'Also :server-cuda, :server-rocm, and more. See docs/docker.md.'
		},
		{
			code: `git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp
cmake -B build
cmake --build build --config Release`,
			id: 'source',
			label: 'From source',
			lang: 'bash',
			note: 'Add backend flags like -DGGML_CUDA=ON. See docs/build.md.'
		}
	];

	let installMethod = $state('script');
</script>

<svelte:head>
	<title>llama.cpp · LLM inference in C/C++</title>
	<meta
		name="description"
		content="llama.cpp is the open-source engine for running large language models, in plain C/C++. Run GGUF models from the terminal, serve an OpenAI-compatible API, and get state-of-the-art performance on almost any hardware."
	/>
</svelte:head>

<!-- A section heading: a small mono eyebrow over the h2, and a lead
     paragraph. Every section uses it, so the rhythm stays the same. -->
{#snippet heading(eyebrow: string, title: string, lead: string)}
	<div class="flex max-w-2xl flex-col gap-4">
		<p class="font-mono text-xs tracking-wider text-accent uppercase">{eyebrow}</p>
		<h2 class="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
		<p class="text-lg leading-relaxed text-pretty text-muted-foreground">{lead}</p>
	</div>
{/snippet}

<main>
	<!-- 1. Hero. The tagline is the project's own ("LLM inference in C/C++",
	     from the README) turned into a promise; the subline says what it is
	     in one sentence. The install command is the primary action -- this
	     audience expects to copy a line into a terminal -- with the docs
	     and GitHub next to it. The terminal on the right shows what happens
	     after you paste it. -->
	<section>
		<div
			class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:px-12 md:py-24 lg:grid-cols-2"
		>
			<div class="flex flex-col items-start gap-7">
				<a
					href={GITHUB_URL}
					class="rounded-full border px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
				>
					Open source · MIT license
				</a>

				<h1
					class="text-5xl leading-[1.02] font-semibold tracking-[-0.035em] text-balance sm:text-6xl"
				>
					LLM inference,<br />on any hardware.
				</h1>

				<p class="max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
					llama.cpp is the open-source engine for running large language models, written in plain
					C/C++. Minimal setup and state-of-the-art performance — on a laptop, a server, or in the
					cloud.
				</p>

				<!-- The install line. Light, not a dark code panel: the terminal
				     beside it is already the hero's one dark block. -->
				<div class="flex w-full max-w-xl flex-col gap-2">
					<div class="flex items-center rounded-xl border bg-muted/60 py-1 pr-1 pl-4">
						<code class="min-w-0 flex-1 overflow-x-auto py-2 font-mono text-sm whitespace-nowrap">
							<span class="text-muted-foreground select-none">{heroOs === 'windows' ? '>' : '$'}</span
							>
							{heroCommand}
						</code>
						<CopyButton text={heroCommand} class="text-muted-foreground hover:text-foreground" />
					</div>
					<div class="flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-xs text-muted-foreground">
						<!-- An OS switch for visitors copying the command for another
						     machine (the default is their own OS). -->
						<span class="flex gap-1">
							{#each [{ id: 'unix', label: 'macOS / Linux' }, { id: 'windows', label: 'Windows' }] as const as os (os.id)}
								<button
									type="button"
									onclick={() => (heroOs = os.id)}
									class="cursor-pointer rounded px-1.5 py-0.5 transition-colors {heroOs === os.id
										? 'bg-muted text-foreground'
										: 'hover:text-foreground'}">{os.label}</button
								>
							{/each}
						</span>
						<span aria-hidden="true" class="max-sm:hidden">·</span>
						<a href="#install" class="underline-offset-4 hover:text-foreground hover:underline"
							>Homebrew, winget, Docker, source…</a
						>
					</div>
				</div>

				<div class="flex flex-wrap gap-3">
					<a
						href={docs('quickstart')}
						class="flex h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-85"
					>
						Quickstart <ArrowRight class="size-4" />
					</a>
					<a
						href={GITHUB_URL}
						class="flex h-11 items-center gap-2 rounded-lg border bg-background px-5 text-sm font-medium transition-colors hover:border-foreground/30"
					>
						<GitHubIcon /> GitHub
					</a>
				</div>

				<!-- The hand-off, right after the terminal commands, for anyone who'd
				     rather not use them. Framed as a preference, not as "not a
				     developer" -- plenty of developers use the app too. -->
				<p class="text-sm text-muted-foreground">
					Prefer a desktop app?
					<a
						href={APP_URL}
						class="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
						>Get Llama</a
					> — llama.cpp in a native app, with nothing to set up.
				</p>
			</div>

			<!-- The terminal. aria-hidden isn't used: the transcript is real
			     content (what the commands do). -->
			<div
				class="overflow-hidden rounded-xl border border-code-border bg-code text-code-foreground shadow-2xl shadow-black/20"
			>
				<div class="flex items-center gap-4 border-b border-code-border px-4">
					<span aria-hidden="true" class="flex gap-1.5">
						<span class="size-2.5 rounded-full bg-white/15"></span>
						<span class="size-2.5 rounded-full bg-white/15"></span>
						<span class="size-2.5 rounded-full bg-white/15"></span>
					</span>
					<div class="flex" role="tablist">
						{#each SESSIONS as s (s.id)}
							<button
								type="button"
								role="tab"
								aria-selected={s.id === sessionId}
								onclick={() => (sessionId = s.id)}
								class="cursor-pointer border-b-2 px-3 py-2.5 font-mono text-xs transition-colors {s.id ===
								sessionId
									? 'border-accent text-code-foreground'
									: 'border-transparent text-code-muted hover:text-code-foreground'}"
							>
								{s.label}
							</button>
						{/each}
					</div>
				</div>
				<!-- Fixed min height so switching tabs doesn't make the page jump. -->
				<div
					class="flex min-h-72 flex-col gap-4 p-5 font-mono text-[12.5px] leading-relaxed sm:text-[13px]"
				>
					{#each session.lines as line, i (i)}
						{#if line.kind === 'cmd'}
							<p class="whitespace-pre-wrap">
								<span class="mr-[1ch] text-accent select-none">$</span>{@html bash(line.text)}
							</p>
						{:else if line.kind === 'input'}
							<p><span class="mr-[1ch] text-code-muted select-none">&gt;</span>{line.text}</p>
						{:else if line.kind === 'output'}
							<p class="text-code-foreground/85">{line.text}</p>
						{:else}
							<p class="text-code-muted">{line.text}</p>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- 2. Stats. Social proof in the currency developers trust: GitHub.
	     Numbers only, no logo wall -- we'd need permission for logos, and
	     the numbers are verifiable. -->
	<!-- The borders sit on the list, not the section, so they stop at the
	     content width. -->
	<section class="mx-auto max-w-6xl px-6 md:px-12">
		<dl class="grid grid-cols-2 border-y md:grid-cols-4">
			{#each stats as s, i (s.label)}
				<div
					class="flex flex-col gap-1 py-8 {i % 2 === 1 ? 'pl-6 max-md:border-l' : ''} {i > 0
						? 'md:border-l md:pl-8'
						: ''} {i > 1 ? 'max-md:border-t' : ''}"
				>
					<dt class="order-2 text-sm text-muted-foreground">{s.label}</dt>
					<dd class="order-1 font-mono text-3xl font-semibold tracking-tight">{s.value}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<div class="mx-auto max-w-6xl px-6 md:px-12">
		<!-- 3. The toolkit. The `llama` binary is new and unifies what used
		     to be a dozen `llama-*` executables, so it's worth a section:
		     "install once, get everything". The list is drawn as `llama help all`
		     output, since that's where a user would actually see it. -->
		<section class="grid grid-cols-1 items-center gap-12 py-24 lg:grid-cols-2">
			<div class="flex flex-col gap-6">
				{@render heading(
					'One binary',
					'The whole toolkit, in one command',
					'Chat with a model in your terminal, serve it over HTTP, benchmark your hardware, or quantize a model — all from one binary. Models download straight from Hugging Face.'
				)}
				<a
					href={docs('cli')}
					class="flex items-center gap-1.5 text-sm font-medium underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
				>
					Using the CLI <ArrowRight class="size-3.5" />
				</a>
			</div>

			<div
				class="overflow-hidden rounded-xl border border-code-border bg-code p-5 font-mono text-[12.5px] leading-7 text-code-foreground sm:text-[13px]"
			>
				<p><span class="mr-[1ch] text-accent select-none">$</span>{@html bash('llama help all')}</p>
				<p class="text-code-muted">Available commands:</p>
				<!-- Two columns that line up, like the real output. On phones
				     the descriptions wrap under the names instead. -->
				<dl class="grid grid-cols-1 sm:grid-cols-[9rem_1fr]">
					{#each COMMANDS as c (c.name)}
						<dt class="pl-4 text-code-foreground">{c.name}</dt>
						<dd class="pl-4 text-code-muted max-sm:mb-1 max-sm:pl-8 sm:pl-0">{c.desc}</dd>
					{/each}
				</dl>
			</div>
		</section>

		<!-- 4. The server. The single most-used part of llama.cpp: most
		     people meet it through an app that talks to `llama serve`. Code
		     first on desktop (it's the thing to copy), features below. -->
		<section class="flex flex-col gap-12 py-24">
			<div class="grid grid-cols-1 items-end gap-12 lg:grid-cols-2">
				{@render heading(
					'llama serve',
					'An OpenAI-compatible server, built in',
					'One command gives you a fast HTTP server with a web UI. Most tools built for the OpenAI API work with it — change the base URL and keep your code.'
				)}
				<CodeTabs tabs={API_TABS} />
			</div>

			<div class="grid grid-cols-1 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
				{#each SERVER_FEATURES as f (f.title)}
					<div class="flex flex-col gap-2 bg-background p-6">
						<f.icon class="mb-2 size-5 text-accent" />
						<h3 class="font-medium">{f.title}</h3>
						<p class="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
					</div>
				{/each}
			</div>

			<div class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
				<a
					href={docs('serve')}
					class="flex items-center gap-1.5 font-medium underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
				>
					Running a server <ArrowRight class="size-3.5" />
				</a>
				<a
					href={docs('api')}
					class="flex items-center gap-1.5 font-medium underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
				>
					API reference <ArrowRight class="size-3.5" />
				</a>
			</div>
		</section>

		<!-- 5. Hardware. The claim in the hero ("any hardware") made
		     specific. Grouped by device, not by backend, because visitors
		     arrive knowing their hardware, not the backend's name. -->
		<section class="flex flex-col gap-12 py-24">
			{@render heading(
				'Backends',
				'Runs on whatever you have',
				'Hand-tuned kernels for every major GPU and CPU, from one codebase. Split a model between CPU and GPU when it doesn’t fit in VRAM, spread it across GPUs, or across machines with RPC.'
			)}

			<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{#each HARDWARE as group (group.title)}
					<div class="flex flex-col gap-4 rounded-xl border p-5">
						<h3 class="text-sm font-medium">{group.title}</h3>
						<ul class="flex flex-col divide-y">
							{#each group.backends as b (b.name)}
								<li class="flex items-baseline justify-between gap-4 py-2.5 text-sm">
									<span class="font-mono font-medium">{b.name}</span>
									<span class="text-right text-muted-foreground">{b.device}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>

			<p class="text-sm text-muted-foreground">
				Setup for each backend is in
				<a
					href={repoDoc('docs/build.md')}
					class="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
					>the build guide</a
				>; splitting a model across devices is in
				<a
					href={repoDoc('docs/multi-gpu.md')}
					class="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
					>multi-GPU</a
				>.
			</p>
		</section>

		<!-- 6. Models. GGUF and quantization are what make local inference
		     possible at all, and they're llama.cpp's own inventions -- so this
		     section explains them, and shows the trade-off with real numbers
		     rather than claiming "small and fast". -->
		<section class="grid grid-cols-1 items-center gap-12 py-24 lg:grid-cols-2">
			<div class="flex flex-col gap-6">
				{@render heading(
					'GGUF',
					'One format for every model',
					'GGUF packs a model’s weights, tokenizer, and metadata together, ready to run. Thousands are on Hugging Face — pass any of them to -hf and it downloads and runs.'
				)}
				<ul class="flex flex-col gap-2.5 text-sm">
					<li class="flex gap-3">
						<span class="mt-2 size-1 shrink-0 rounded-full bg-accent"></span>
						<span
							>Quantize from 16 bits down to about 1 bit per weight, with <code class="font-mono text-[13px]"
								>llama quantize</code
							></span
						>
					</li>
					<li class="flex gap-3">
						<span class="mt-2 size-1 shrink-0 rounded-full bg-accent"></span>
						<span
							>Convert Hugging Face models with <code class="font-mono text-[13px]"
								>convert_hf_to_gguf.py</code
							></span
						>
					</li>
					<li class="flex gap-3">
						<span class="mt-2 size-1 shrink-0 rounded-full bg-accent"></span>
						<span>Models are kept in the standard Hugging Face cache, shared with other tools</span>
					</li>
				</ul>
				<a
					href={GGUF_MODELS_URL}
					class="flex items-center gap-1.5 text-sm font-medium underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
				>
					Browse GGUF models on Hugging Face <ArrowUpRight class="size-3.5" />
				</a>
			</div>

			<!-- The quantization chart. Bars are sized relative to F16, so the
			     savings are visible at a glance; the perplexity increase is the
			     honest cost. Q4_K_M is highlighted as the usual sweet spot. -->
			<figure class="flex flex-col gap-4 rounded-xl border p-5 sm:p-6">
				<figcaption class="flex items-baseline justify-between gap-4">
					<span class="text-sm font-medium">Llama 3 8B, quantized</span>
					<span class="text-xs text-muted-foreground">size · perplexity increase</span>
				</figcaption>
				<ul class="flex flex-col gap-2.5">
					{#each QUANTS as q (q.name)}
						{@const hi = q.name === HIGHLIGHT_QUANT}
						<li class="grid grid-cols-[4.5rem_1fr] items-center gap-3 text-xs sm:grid-cols-[5rem_1fr]">
							<span class="font-mono {hi ? 'font-semibold text-accent' : ''}">{q.name}</span>
							<span class="flex items-center gap-2.5">
								<span
									class="h-5 rounded {hi ? 'bg-accent' : 'bg-foreground/15'}"
									style="width: {(q.size / F16_SIZE) * 72}%"
								></span>
								<span class="font-mono whitespace-nowrap {hi ? 'font-medium' : ''}">
									{q.size.toFixed(2)}
									<span class="text-muted-foreground">GiB</span>
								</span>
								<span class="ml-auto font-mono whitespace-nowrap text-muted-foreground">
									{q.ppl === null ? 'baseline' : `+${q.ppl.toFixed(q.ppl < 0.1 ? 3 : 2)}`}
								</span>
							</span>
						</li>
					{/each}
				</ul>
				<p class="border-t pt-4 text-xs leading-relaxed text-muted-foreground">
					<span class="font-medium text-foreground">Q4_K_M</span> is a third of the size of F16, for a
					small loss in quality — the usual starting point. Quantized figures from
					<code class="font-mono">llama quantize</code>.
				</p>
			</figure>
		</section>

		<!-- 7. The C API. For the people building llama.cpp *into* something:
		     app developers, binding authors, researchers. The snippet shows
		     that the core loop fits on a screen. -->
		<section class="grid grid-cols-1 items-center gap-12 py-24 lg:grid-cols-2">
			<div class="flex flex-col gap-8">
				{@render heading(
					'libllama',
					'Build it into anything',
					'The same C API that powers llama cli and llama serve, with no external dependencies. Load a model, decode, sample, and ship it in your app, on your device, or behind your service.'
				)}
				<ul class="grid grid-cols-1 gap-2 sm:grid-cols-2">
					{#each EMBED_TARGETS as t (t.label)}
						<li>
							<a
								href={t.href}
								class="flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors hover:border-foreground/30"
							>
								<span class="flex flex-col">
									<span class="font-mono text-sm font-medium">{t.label}</span>
									<span class="text-xs text-muted-foreground">{t.note}</span>
								</span>
								<ArrowUpRight class="size-3.5 shrink-0 text-muted-foreground" />
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<CodeTabs tabs={C_TABS} />
		</section>

		<!-- 8. Install, every way. The hero has the one-liner; this is for
		     people with a preference (a package manager, a container, their
		     own build flags). Anchored, so the hero can link here. -->
		<section id="install" class="flex flex-col gap-10 py-24">
			<div class="grid grid-cols-1 items-end gap-12 lg:grid-cols-2">
				{@render heading(
					'Install',
					'Get llama.cpp your way',
					'Every method gives you the same tools. Prebuilt binaries for the major platforms and backends are also on the releases page.'
				)}
				<div class="flex flex-col gap-3">
					<CodeTabs tabs={INSTALL_TABS} bind:selected={installMethod} />
				</div>
			</div>
			<div class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
				<a
					href={docs('installation')}
					class="flex items-center gap-1.5 font-medium underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
				>
					Installation guide <ArrowRight class="size-3.5" />
				</a>
				<a
					href={`${GITHUB_URL}/releases`}
					class="flex items-center gap-1.5 font-medium underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
				>
					Releases <ArrowUpRight class="size-3.5" />
				</a>
			</div>
		</section>

		<!-- 9. The hand-off to llama.app. The inverse of llama.app's "Built
		     on llama.cpp": here, the app is where non-developers should go.
		     It's a full-width band rather than a small link, so a newcomer
		     scrolling to the bottom can't miss it. The mark is the same
		     llama as ours -- the app is ours too. -->
		<section class="pt-8 pb-24">
			<div
				class="grid grid-cols-1 items-center gap-8 rounded-2xl border bg-muted/50 p-8 sm:p-10 md:grid-cols-[auto_1fr_auto] md:gap-10"
			>
				<span
					class="flex size-16 items-center justify-center rounded-2xl bg-foreground text-background [&_svg]:w-8"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html logoSvg}
				</span>
				<div class="flex flex-col gap-2">
					<h2 class="text-2xl font-semibold tracking-tight">Just want to use local AI?</h2>
					<p class="max-w-xl leading-relaxed text-pretty text-muted-foreground">
						Llama is our desktop app, built on llama.cpp. It runs the engine for you, picks models that
						fit your computer, and gives your other apps a local API — nothing to compile or
						configure.
					</p>
				</div>
				<a
					href={APP_URL}
					class="flex h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-sm font-medium whitespace-nowrap text-background transition-opacity hover:opacity-85"
				>
					Get Llama <ArrowUpRight class="size-4" />
				</a>
			</div>
		</section>
	</div>
</main>
