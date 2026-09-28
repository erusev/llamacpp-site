// Prism with the grammars the homepage snippets need. The grammar files are
// side-effect scripts that register themselves on the global `Prism`, so
// they must be imported after the core. (The docs' code blocks don't use
// this: mdsvex highlights those at build time.)
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';

export default Prism;
