import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import type { SiteCustomFields } from '@site/src/data/packages';

/** The installed `@pixi/3d` and whether it's still in closed beta, from `customFields.pixi3d` */
export function usePixi3d(): SiteCustomFields['pixi3d'] {
  return (useDocusaurusContext().siteConfig.customFields as unknown as SiteCustomFields).pixi3d;
}
