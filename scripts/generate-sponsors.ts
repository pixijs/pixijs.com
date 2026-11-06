import dotenv from 'dotenv';
import { fetchSponsors, type SponsorkitConfig, type Sponsorship, tierPresets } from 'sponsorkit';
import fs from 'fs';
import sharp from 'sharp';
dotenv.config();

const SPONSORS_PATH = 'src/data/sponsors.json';
const PRIVATE_SPONSORS_PATH = 'src/data/sponsors-private.json';
const OVERRIDES_PATH = 'src/data/sponsor-overrides.json';
const MANUAL_SPONSORS_PATH = 'src/data/manualSponsors.json';
const README_IMAGE_PATH = 'static/sponsors-readme.svg';
const README_IMAGE_MAX_WIDTH = 800;
const README_IMAGE_GAP = 16;
// Platinum and Gold from SponsorshipTiers.tsx; Gold is the lowest tier that includes a README logo.
const README_IMAGE_TIERS = [
  { minMonthlyDollars: 2000, cardWidth: 300, cardHeight: 126, padding: 24 },
  { minMonthlyDollars: 500, cardWidth: 200, cardHeight: 84, padding: 16 },
];
const SPONSOR_GRACE_PERIOD_MS = 28 * 24 * 60 * 60 * 1000;
const sponsorNameCollator = new Intl.Collator('en', { sensitivity: 'base' });

type SponsorOverride = {
  login: string;
  name?: string;
  avatarUrl?: string;
  linkUrl?: string;
  privacyLevel?: string;
};

type SponsorshipWithoutRaw = Omit<Sponsorship, 'raw'>;
type StoredSponsorship = SponsorshipWithoutRaw & {
  lastSeenAt: string;
};
type ReadmeSponsor = {
  monthlyDollars: number;
  isOneTime?: boolean;
  sponsor: { login: string; avatarUrl: string };
};

function mergeSponsorRecords<T extends Record<string, unknown>>(existing: T | undefined, incoming: T): T {
  if (!existing) {
    return incoming;
  }

  const merged = {
    ...existing,
    ...incoming,
  } as Record<string, unknown>;

  for (const [key, value] of Object.entries(existing)) {
    if ((merged[key] === undefined || merged[key] === null) && value !== undefined && value !== null) {
      merged[key] = value;
    }
  }

  return merged as T;
}

function isValidDateString(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isSponsorshipRecord(value: unknown): value is SponsorshipWithoutRaw {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<SponsorshipWithoutRaw>;

  return Boolean(
    candidate.sponsor &&
    typeof candidate.sponsor === 'object' &&
    typeof candidate.privacyLevel === 'string' &&
    typeof candidate.monthlyDollars === 'number',
  );
}

function getSponsorIdentity(sponsor: SponsorshipWithoutRaw): string {
  const socialLogins = sponsor.sponsor.socialLogins ?? {};
  const socialIdentity = socialLogins.opencollective || socialLogins.github;

  const identity =
    socialIdentity ||
    sponsor.sponsor.login ||
    sponsor.sponsor.linkUrl ||
    sponsor.sponsor.websiteUrl ||
    `${sponsor.sponsor.name}:${sponsor.sponsor.avatarUrl}`;

  return identity.toLowerCase();
}

function getSponsorSortName(sponsor: SponsorshipWithoutRaw): string {
  return sponsor.sponsor.name || sponsor.sponsor.login || sponsor.sponsor.websiteUrl || sponsor.sponsor.linkUrl || '';
}

function sortSponsorsAlphabetically<T extends SponsorshipWithoutRaw>(sponsors: T[]): T[] {
  return [...sponsors].sort((a, b) => {
    const nameCompare = sponsorNameCollator.compare(getSponsorSortName(a), getSponsorSortName(b));

    if (nameCompare !== 0) {
      return nameCompare;
    }

    return sponsorNameCollator.compare(getSponsorIdentity(a), getSponsorIdentity(b));
  });
}

function readStoredSponsors(filePath: string, fallbackLastSeenAt: string): StoredSponsorship[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown;

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.flatMap((entry) => {
    if (!isSponsorshipRecord(entry)) {
      return [];
    }

    const candidate = entry as Partial<StoredSponsorship>;

    return [
      {
        ...entry,
        lastSeenAt: isValidDateString(candidate.lastSeenAt) ? candidate.lastSeenAt : fallbackLastSeenAt,
      },
    ];
  });
}

function mergeSponsorsWithGracePeriod(
  currentSponsors: SponsorshipWithoutRaw[],
  previousSponsors: StoredSponsorship[],
  nowIso: string,
) {
  const mergedByIdentity = new Map<string, StoredSponsorship>();
  const nowMs = Date.parse(nowIso);

  for (const sponsor of currentSponsors) {
    const identity = getSponsorIdentity(sponsor);
    const currentRecord: StoredSponsorship = {
      ...sponsor,
      lastSeenAt: nowIso,
    };

    mergedByIdentity.set(identity, mergeSponsorRecords(mergedByIdentity.get(identity), currentRecord));
  }

  const retainedGraceSponsorsList: string[] = [];

  for (const sponsor of previousSponsors) {
    const identity = getSponsorIdentity(sponsor);
    const existing = mergedByIdentity.get(identity);

    if (existing) {
      mergedByIdentity.set(identity, mergeSponsorRecords(sponsor, existing));
      continue;
    }

    const lastSeenAtMs = Date.parse(sponsor.lastSeenAt);

    if (Number.isNaN(lastSeenAtMs)) {
      continue;
    }

    if (nowMs - lastSeenAtMs <= SPONSOR_GRACE_PERIOD_MS) {
      mergedByIdentity.set(identity, sponsor);
      retainedGraceSponsorsList.push(identity);
    }
  }

  return {
    sponsors: Array.from(mergedByIdentity.values()),
    retainedGraceSponsorsList,
  };
}

async function readLogo(avatarUrl: string): Promise<Buffer> {
  if (avatarUrl.startsWith('/')) {
    return fs.readFileSync(`static${avatarUrl}`);
  }

  const response = await fetch(avatarUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch sponsor logo ${avatarUrl}: ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function logoToDataUri(avatarUrl: string, width: number, height: number): Promise<string> {
  const png = await sharp(await readLogo(avatarUrl), { density: 300 })
    .trim()
    .resize({ width: width * 2, height: height * 2, fit: 'inside' })
    .png()
    .toBuffer();

  return `data:image/png;base64,${png.toString('base64')}`;
}

// READMEs load this through <img>, which blocks external resources, so logos must be embedded.
async function writeReadmeImage(sponsors: ReadmeSponsor[], overrides: SponsorOverride[]) {
  const logoOverrides = new Map(overrides.map((o) => [o.login.toLowerCase(), o.avatarUrl]));
  const recurring = sponsors.filter((s) => !s.isOneTime).sort((a, b) => b.monthlyDollars - a.monthlyDollars);

  const rows = README_IMAGE_TIERS.flatMap((tier, index) => {
    const tierCeiling = README_IMAGE_TIERS[index - 1]?.minMonthlyDollars ?? Infinity;
    const tierSponsors = recurring.filter(
      (s) => s.monthlyDollars >= tier.minMonthlyDollars && s.monthlyDollars < tierCeiling,
    );
    const perRow = Math.floor((README_IMAGE_MAX_WIDTH + README_IMAGE_GAP) / (tier.cardWidth + README_IMAGE_GAP));

    return Array.from({ length: Math.ceil(tierSponsors.length / perRow) }, (_, rowIndex) => {
      const rowSponsors = tierSponsors.slice(rowIndex * perRow, (rowIndex + 1) * perRow);

      return {
        ...tier,
        sponsors: rowSponsors,
        width: rowSponsors.length * (tier.cardWidth + README_IMAGE_GAP) - README_IMAGE_GAP,
      };
    });
  });

  const imageWidth = Math.max(0, ...rows.map((row) => row.width));
  let nextRowY = 0;

  const cards = await Promise.all(
    rows.flatMap(({ sponsors: rowSponsors, cardWidth, cardHeight, padding, width }) => {
      const y = nextRowY;

      nextRowY += cardHeight + README_IMAGE_GAP;

      return rowSponsors.map(async ({ sponsor }, column) => {
        const x = (imageWidth - width) / 2 + column * (cardWidth + README_IMAGE_GAP);
        const logoWidth = cardWidth - padding * 2;
        const logoHeight = cardHeight - padding * 2;
        const logo = await logoToDataUri(
          logoOverrides.get(sponsor.login.toLowerCase()) || sponsor.avatarUrl,
          logoWidth,
          logoHeight,
        );

        return (
          `<rect x="${x + 0.5}" y="${y + 0.5}" width="${cardWidth - 1}" height="${cardHeight - 1}" rx="14" fill="#fff" stroke="#d0d7de"/>` +
          `<image x="${x + padding}" y="${y + padding}" width="${logoWidth}" height="${logoHeight}" href="${logo}"/>`
        );
      });
    }),
  );

  const imageHeight = Math.max(0, nextRowY - README_IMAGE_GAP);

  fs.writeFileSync(
    README_IMAGE_PATH,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${imageWidth}" height="${imageHeight}" viewBox="0 0 ${imageWidth} ${imageHeight}">${cards.join('')}</svg>\n`,
  );
  console.log(`Wrote ${README_IMAGE_PATH} with ${cards.length} sponsors.`);
}

async function main() {
  if (
    !process.env.SPONSORKIT_GITHUB_TOKEN ||
    !process.env.SPONSORKIT_GITHUB_LOGIN ||
    !process.env.SPONSORKIT_OPENCOLLECTIVE_SLUG ||
    !process.env.SPONSORKIT_OPENCOLLECTIVE_KEY
  ) {
    throw new Error('Missing required environment variables for Sponsorkit');
  }

  const config: SponsorkitConfig = {
    github: {
      token: process.env.SPONSORKIT_GITHUB_TOKEN,
      login: process.env.SPONSORKIT_GITHUB_LOGIN,
      type: 'organization', // or 'user' depending on your account type
    },
    opencollective: {
      slug: process.env.SPONSORKIT_OPENCOLLECTIVE_SLUG,
      key: process.env.SPONSORKIT_OPENCOLLECTIVE_KEY,
    },
    includePrivate: true,
    includePastSponsors: false, // Set to true if you want to include past sponsors
    sponsorsAutoMerge: true,
    tiers: [
      // Default tier
      {
        title: 'Bronze Sponsors',
        monthlyDollars: 100,
        preset: tierPresets.xl,
      },
      {
        title: 'Silver Sponsors',
        monthlyDollars: 250,
        preset: tierPresets.medium,
      },
      {
        title: 'Gold Sponsors',
        monthlyDollars: 500,
        preset: tierPresets.large,
      },
      {
        title: 'Platinum Sponsors',
        monthlyDollars: 2500,
        preset: tierPresets.xl,
      },
    ],
  };

  const nowIso = new Date().toISOString();
  const previousSponsors = [
    ...readStoredSponsors(SPONSORS_PATH, nowIso),
    ...readStoredSponsors(PRIVATE_SPONSORS_PATH, nowIso),
  ];

  let sponsors = await fetchSponsors(config);
  sponsors = sponsors.filter((sponsor) => sponsor.monthlyDollars >= 100);

  const sanitizedSponsors = sponsors.map((sponsor) => {
    const { raw, ...rest } = sponsor;
    return rest;
  });

  const { sponsors: mergedSponsors, retainedGraceSponsorsList } = mergeSponsorsWithGracePeriod(
    sanitizedSponsors,
    previousSponsors,
    nowIso,
  );

  const overrides: SponsorOverride[] = JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'));
  const privateOverrides = new Map(
    overrides.filter((o) => o.privacyLevel === 'PRIVATE').map((o) => [o.login.toLowerCase(), o]),
  );

  const promotedSponsors = mergedSponsors.map((s) => {
    const override = privateOverrides.get(s.sponsor.login.toLowerCase());

    if (!override || s.privacyLevel !== 'PRIVATE') {
      return s;
    }

    return {
      ...s,
      privacyLevel: 'PUBLIC' as const,
      sponsor: {
        ...s.sponsor,
        login: override.login,
        name: override.name ?? override.login,
        avatarUrl: override.avatarUrl ?? '',
        linkUrl: override.linkUrl,
      },
    };
  });

  const publicSponsors = sortSponsorsAlphabetically(promotedSponsors.filter((s) => s.privacyLevel !== 'PRIVATE'));
  const privateSponsors = sortSponsorsAlphabetically(promotedSponsors.filter((s) => s.privacyLevel === 'PRIVATE'));

  const graceCount = retainedGraceSponsorsList.length;
  const graceSummary = graceCount > 0 ? `${graceCount} (${retainedGraceSponsorsList.join(', ')})` : '0';

  console.log(
    `Found ${publicSponsors.length} public and ${privateSponsors.length} private sponsors (>= $100/month); retained ${graceSummary} in grace period.`,
  );

  fs.writeFileSync(SPONSORS_PATH, JSON.stringify(publicSponsors, null, 2));
  fs.writeFileSync(PRIVATE_SPONSORS_PATH, JSON.stringify(privateSponsors, null, 2));

  const manualSponsors: ReadmeSponsor[] = JSON.parse(fs.readFileSync(MANUAL_SPONSORS_PATH, 'utf8'));

  await writeReadmeImage([...publicSponsors, ...manualSponsors], overrides);
}

// @ts-expect-error - top level await does work
await main().catch((err) => {
  console.error('Error fetching sponsors:', err);
  process.exitCode = 1;
});
