import { redirect } from '@sveltejs/kit';

// /docs has no page of its own. The pages live one level down, so that the
// relative links between them (`[Quickstart](quickstart)`) resolve.
export const load = () => redirect(307, '/docs/introduction');
