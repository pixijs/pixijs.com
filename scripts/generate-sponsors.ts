import dotenv from 'dotenv';
import { fetchSponsors, type SponsorkitConfig, type Sponsorship, tierPresets } from 'sponsorkit';
import fs from 'fs';
dotenv.config();

const SPONSORS_PATH = 'src/data/sponsors.json';
const PRIVATE_SPONSORS_PATH = 'src/data/sponsors-private.json';
const SPONSOR_GRACE_PERIOD_MS = 28 * 24 * 60 * 60 * 1000;

type SponsorshipWithoutRaw = Omit<Sponsorship, 'raw'>;
type StoredSponsorship = SponsorshipWithoutRaw & {
  lastSeenAt: string;
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

  let retainedGraceSponsors = 0;

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
      retainedGraceSponsors += 1;
    }
  }

  return {
    sponsors: Array.from(mergedByIdentity.values()),
    retainedGraceSponsors,
  };
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

  const { sponsors: mergedSponsors, retainedGraceSponsors } = mergeSponsorsWithGracePeriod(
    sanitizedSponsors,
    previousSponsors,
    nowIso,
  );

  const publicSponsors = mergedSponsors.filter((s) => s.privacyLevel !== 'PRIVATE');
  const privateSponsors = mergedSponsors.filter((s) => s.privacyLevel === 'PRIVATE');

  console.log(
    `Found ${publicSponsors.length} public and ${privateSponsors.length} private sponsors (>= $100/month); retained ${retainedGraceSponsors} in grace period.`,
  );

  fs.writeFileSync(SPONSORS_PATH, JSON.stringify(publicSponsors, null, 2));
  fs.writeFileSync(PRIVATE_SPONSORS_PATH, JSON.stringify(privateSponsors, null, 2));
}

// @ts-expect-error - top level await does work
await main().catch((err) => {
  console.error('Error fetching sponsors:', err);
});
