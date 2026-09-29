// Prism with the grammars the homepage snippets need. The grammar files are
// side-effect scripts that register themselves on the global `Prism`, so
// they must be imported after the core. (The docs' code blocks don't use
// this: mdsvex highlights those at build time.)
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-bash';

// Prism's bash grammar colors known commands (`curl`, `git`, ...) as
// functions, but doesn't know `llama` -- without this, the site's main
// command would be the one thing left uncolored.
Prism.languages.insertBefore('bash', 'function', {
	llama: { pattern: /(^|[\s;|&])llama(?=\s|$)/m, lookbehind: true, alias: 'function' }
});

export default Prism;
