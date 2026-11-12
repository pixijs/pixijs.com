import SegmentedControl from '@site/src/components/ui/SegmentedControl';
import { usePackage } from './package';

import type { PackageId } from '@site/src/data/packages';

interface PackageSwitchProps {
  /** Which page of each package the switch links to */
  section: 'examples' | 'tutorials' | 'playground';
  className?: string;
}

/** 2D / 3D links between the two packages' galleries, tutorials or playgrounds; 7.x pages have no 3D twin */
export default function PackageSwitch({ section, className }: PackageSwitchProps) {
  const { pkg, versionName, packages } = usePackage();

  if (versionName !== 'current') return null;

  return (
    <SegmentedControl<PackageId>
      as="links"
      size="sm"
      className={className}
      label="Package"
      value={pkg ?? '2d'}
      options={(['2d', '3d'] as const).map((id) => ({
        value: id,
        label: packages[id].label,
        to: packages[id].versions.current[section],
      }))}
    />
  );
}
