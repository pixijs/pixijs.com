import { useActivePluginAndVersion } from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { PIXI_V7_VERSION } from '@site/src/data/packages';

export { PIXI_V7_VERSION };

export function usePixiVersion(): string {
  const { siteConfig } = useDocusaurusContext();
  const docsVersion = useActivePluginAndVersion()?.activeVersion?.name;

  return docsVersion === '7.x' ? PIXI_V7_VERSION : String(siteConfig.customFields?.pixiVersion);
}

export const isPreV8 = (pixiVersion: string) => Number(pixiVersion.split('.')[0]) < 8;
