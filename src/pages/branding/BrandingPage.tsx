import { Download } from 'lucide-react';
import React from 'react';
import styles from './Branding.module.scss';
import { useClassModifier } from '@site/src/hooks/useContainerClassNameModifier';

interface BrandingAsset {
  name: string;
  previewWrapper?: string;
  description: string;
  previewUrl: string;
  downloads: { format: string; url: string }[];
}

const bannerAsset: BrandingAsset = {
  name: 'Banner',
  description: 'Displayed at the top of our README.',
  previewUrl: 'https://files.pixijs.download/branding/pixijs-banner.png',
  downloads: [{ format: 'PNG', url: 'https://files.pixijs.download/branding/pixijs-banner.png' }],
};

const logoAssets: BrandingAsset[] = [
  {
    name: 'Logo (Dark)',
    description: '',
    previewUrl: 'https://files.pixijs.download/branding/pixijs-logo-full-dark.png',
    downloads: [
      { format: 'SVG', url: 'https://files.pixijs.download/branding/pixijs-logo-full-dark.svg' },
      { format: 'PNG', url: 'https://files.pixijs.download/branding/pixijs-logo-full-dark.png' },
    ],
  },
  {
    name: 'Logo (Dark, Transparent)',
    previewWrapper: styles.previewWrapperShort,
    description: '',
    previewUrl: 'https://files.pixijs.download/branding/pixijs-logo-transparent-dark.png',
    downloads: [
      { format: 'SVG', url: 'https://files.pixijs.download/branding/pixijs-logo-transparent-dark.svg' },
      { format: 'PNG', url: 'https://files.pixijs.download/branding/pixijs-logo-transparent-dark.png' },
    ],
  },
  {
    name: 'Logo (Pink)',
    description: '',
    previewUrl: 'https://files.pixijs.download/branding/pixijs-logo-full-light.png',
    downloads: [
      { format: 'SVG', url: 'https://files.pixijs.download/branding/pixijs-logo-full-light.svg' },
      { format: 'PNG', url: 'https://files.pixijs.download/branding/pixijs-logo-full-light.png' },
    ],
  },
  {
    name: 'Logo (Pink, Transparent)',
    previewWrapper: styles.previewWrapperShort,
    description: '',
    previewUrl: 'https://files.pixijs.download/branding/pixijs-logo-transparent-light.png',
    downloads: [
      { format: 'SVG', url: 'https://files.pixijs.download/branding/pixijs-logo-transparent-light.svg' },
      { format: 'PNG', url: 'https://files.pixijs.download/branding/pixijs-logo-transparent-light.png' },
    ],
  },
];

const markAssets: BrandingAsset[] = [
  {
    name: 'Mark (Pink)',
    description: 'Standard pink mark.',
    previewUrl: 'https://files.pixijs.download/branding/pixijs-logo-mark-dark.png',
    downloads: [
      { format: 'SVG', url: 'https://files.pixijs.download/branding/pixijs-logo-mark-dark.svg' },
      { format: 'PNG', url: 'https://files.pixijs.download/branding/pixijs-logo-mark-dark.png' },
    ],
  },
  {
    name: 'Mark (Light)',
    description: 'Light-colored mark.',
    previewUrl: 'https://files.pixijs.download/branding/pixijs-logo-mark-light.png',
    downloads: [
      { format: 'SVG', url: 'https://files.pixijs.download/branding/pixijs-logo-mark-light.svg' },
      { format: 'PNG', url: 'https://files.pixijs.download/branding/pixijs-logo-mark-light.png' },
    ],
  },
];

const AssetCard: React.FC<{ asset: BrandingAsset }> = ({ asset }) => (
  <div className={styles.assetCard}>
    <div className={asset.previewWrapper ? asset.previewWrapper : styles.previewWrapper}>
      <img src={asset.previewUrl} alt={asset.name} className={styles.previewImage} loading="lazy" />
    </div>
    <div className={styles.assetInfo}>
      <h3 className={styles.assetName}>{asset.name}</h3>
      <div className={styles.buttonGroup}>
        {asset.downloads.map((download) => (
          <a
            key={download.format}
            href={download.url}
            download
            className={download.format === 'SVG' ? styles.downloadButton : styles.viewButton}
          >
            <Download size={14} />
            {download.format}
          </a>
        ))}
      </div>
    </div>
  </div>
);

const BrandingPage: React.FC = () => {
  useClassModifier('.main-wrapper', 'tileBackground', true);
  return (
    <main className={styles.brandingPage}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className="underline">Branding</h1>
          <p className={styles.subtitle}>
            PixiJS branding assets for your site, game, or app. All assets are free to use. Questions or requests?{' '}
            <a
              href="https://github.com/pixijs/pixijs.com/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.standardLink}
            >
              File an issue
            </a>
            .
          </p>
        </div>
      </section>

      <section className={styles.assetsSection}>
        <h2>Banner</h2>
        <div className={styles.bannerGrid}>
          <AssetCard asset={bannerAsset} />
        </div>
      </section>

      <section className={styles.assetsSection}>
        <h2>Logo</h2>
        <p className={styles.sectionDescription}>Use the Logo where the audience may not be familiar with PixiJS.</p>
        <div className={styles.assetsGrid}>
          {logoAssets.map((asset) => (
            <AssetCard key={asset.name} asset={asset} />
          ))}
        </div>
      </section>

      <section className={styles.assetsSection}>
        <h2>Mark</h2>
        <p className={styles.sectionDescription}>
          Use the Mark where the audience is familiar with the ecosystem, such as Discord users, plugin authors, or
          social media followers.
        </p>
        <div className={styles.markGrid}>
          {markAssets.map((asset) => (
            <AssetCard key={asset.name} asset={asset} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default BrandingPage;
