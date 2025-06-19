import dotenv from 'dotenv';
import { fetchSponsors, type SponsorkitConfig, tierPresets } from 'sponsorkit';
import fs from 'fs';
dotenv.config();

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
    includePastSponsors: false, // Set to true if you want to include past sponsors
    sponsorsAutoMerge: true,
    tiers: [
      // Default tier
      {
        title: 'Sponsors ahhhh',
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

  let sponsors = await fetchSponsors(config);
  sponsors = sponsors.filter((sponsor) => {
    // Filter out sponsors with less than $100 monthly contribution
    return sponsor.monthlyDollars >= 100;
  });
  // delete raw data
  sponsors = sponsors.map((sponsor) => {
    const { raw, ...rest } = sponsor;
    return rest;
  });

  fs.writeFileSync('src/data/sponsors.json', JSON.stringify(sponsors, null, 2));
}

// @ts-expect-error - top level await does work
await main().catch((err) => {
  console.error('Error fetching sponsors:', err);
  // write a simple sponsor.json file with an error message
  fs.writeFileSync(
    'src/data/sponsors.json',
    JSON.stringify(
      [
        {
          sponsor: {
            name: 'Test',
            type: 'Organization',
            login: 'test',
            avatarUrl: '/images/logo-playco.png',
            websiteUrl: 'https://test.com',
            linkUrl: 'https://opencollective.com/test',
            socialLogins: {
              opencollective: 'test',
            },
          },
          isOneTime: false,
          monthlyDollars: 100,
          privacyLevel: 'PUBLIC',
          tierName: 'sponsor',
        },
      ],
      null,
      2,
    ),
  );
});
