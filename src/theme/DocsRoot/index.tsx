import renderRoutes from '@docusaurus/renderRoutes';
import { matchPath, useLocation } from '@docusaurus/router';
import { HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import NotFound from '@theme/NotFound';

import type { Props } from '@theme/DocsRoot';

/**
 * Ejected (theme-classic 3.10.2): `DocRoot/Layout` renders the rail, because only it has the doc sidebar. The default
 * docs instance is mounted at `/`, so it also receives every unknown path: those get the regular 404 page.
 */
export default function DocsRoot({ route }: Props) {
  const { pathname } = useLocation();
  const routes = route.routes!;

  if (!routes.some((child) => matchPath(pathname, child))) return <NotFound />;

  return (
    <HtmlClassNameProvider className={ThemeClassNames.wrapper.docsPages}>
      <Layout rail="docs">{renderRoutes(routes)}</Layout>
    </HtmlClassNameProvider>
  );
}
