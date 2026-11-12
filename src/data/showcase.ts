import sponsorData from './sponsors.json';

export type ShowcaseKind = 'game' | 'app' | 'site';

export interface ShowcaseItem {
  title: string;
  kind: ShowcaseKind;
  author: string;
  imageUrl: string;
  link: string;
  alt?: string;
  openSourceLink?: string;
  sponsoredLink?: string;
}

interface ShowcaseSponsor {
  login: string;
  linkUrl?: string;
}

type ShowcaseSourceItem = Omit<ShowcaseItem, 'sponsoredLink'> & {
  sponsor?: ShowcaseSponsor;
};

interface SponsorRecord {
  lastSeenAt?: string;
  sponsor: {
    login?: string;
    websiteUrl?: string;
    linkUrl?: string;
  };
}

const sponsors = sponsorData as SponsorRecord[];

const getLastSeenAtTime = (sponsor: SponsorRecord): number | undefined => {
  if (!sponsor.lastSeenAt) {
    return undefined;
  }

  const time = Date.parse(sponsor.lastSeenAt);

  return Number.isFinite(time) ? time : undefined;
};

let latestSponsorLastSeenAtTime: number | undefined;

for (const sponsor of sponsors) {
  const time = getLastSeenAtTime(sponsor);

  if (time !== undefined && (latestSponsorLastSeenAtTime === undefined || time > latestSponsorLastSeenAtTime)) {
    latestSponsorLastSeenAtTime = time;
  }
}

// Grace-period sponsors carry an older lastSeenAt; keep only the latest run.
const activeSponsorsByLogin = new Map<string, SponsorRecord>();

for (const sponsor of sponsors) {
  const login = sponsor.sponsor.login?.toLowerCase();

  if (!login) continue;
  if (latestSponsorLastSeenAtTime !== undefined && getLastSeenAtTime(sponsor) !== latestSponsorLastSeenAtTime) continue;

  activeSponsorsByLogin.set(login, sponsor);
}

const resolveSponsoredLink = (sponsor?: ShowcaseSponsor): string | undefined => {
  if (!sponsor) {
    return undefined;
  }

  const activeSponsor = activeSponsorsByLogin.get(sponsor.login.toLowerCase());

  if (!activeSponsor) {
    return undefined;
  }

  return sponsor.linkUrl || activeSponsor.sponsor.websiteUrl || activeSponsor.sponsor.linkUrl;
};

const showcaseSourceItems: ShowcaseSourceItem[] = [
  {
    title: 'Super Typo Kart',
    kind: 'game',
    author: 'Fatal Exit',
    imageUrl: '/showcase/super-typo-kart.webp',
    link: 'https://wavedash.com/games/super-typo-kart',
    sponsor: {
      login: 'wvdsh',
    },
  },
  {
    title: 'DEAD SUN',
    kind: 'game',
    author: 'Fatal Exit',
    imageUrl: '/showcase/DEADSUN.webp',
    link: 'https://wavedash.com/games/dead-sun',
  },
  {
    title: 'Not a Trolley Problem. JAM',
    kind: 'game',
    author: 'd954mas',
    imageUrl: '/showcase/not-a-trolley-problem.webp',
    link: 'https://wavedash.com/games/not-a-trolley-problem-jam',
  },
  {
    title: 'Emerald Woods',
    kind: 'game',
    author: `Slashware Interactive`,
    imageUrl: '/showcase/emerald-woods.webp',
    link: 'https://slash.itch.io/emerald-woods',
  },
  {
    title: 'Bubbo Bubbo',
    kind: 'game',
    author: `PixiJS Open Games: Ash Cook`,
    imageUrl: '/showcase/bubbo-bubbo.webp',
    link: 'https://pixijs.io/open-games/bubbo-bubbo/',
    openSourceLink: 'https://github.com/pixijs/open-games/tree/main/bubbo-bubbo',
  },
  {
    title: 'Puzzling Potions',
    kind: 'game',
    author: `PixiJS Open Games: Mauro`,
    imageUrl: '/showcase/puzzling-potions.webp',
    link: 'https://pixijs.io/open-games/puzzling-potions/',
    openSourceLink: 'https://github.com/pixijs/open-games/tree/main/puzzling-potions',
  },
  {
    title: 'Dot to dot',
    kind: 'site',
    author: `Cuchillo`,
    imageUrl: '/showcase/dot-to-dot.webp',
    link: 'https://dottodot.es/es/',
  },
  {
    title: 'Semantris',
    kind: 'game',
    author: 'Google Research',
    imageUrl: '/showcase/semantris.webp',
    link: 'https://research.google.com/semantris',
  },
  {
    title: 'Party 32: Version 1',
    kind: 'game',
    author: 'Matt / Stopdoor',
    imageUrl: '/showcase/party32version1.webp',
    link: 'https://party32.com',
  },
  {
    title: 'UIX',
    kind: 'site',
    author: 'Kadir Inan',
    imageUrl: '/showcase/uix.webp',
    link: 'https://www.uix.me/',
  },
  {
    title: 'Kinda Hard Golf',
    kind: 'game',
    author: `James O'Halloran (Mighty Pebble Games)`,
    imageUrl: '/showcase/kinda-hard-golf.jpg',
    link: 'https://kindahardgolf.com/',
  },
  {
    title: 'Genshin/Sky Music',
    kind: 'app',
    author: 'Specy',
    imageUrl: '/showcase/genshin-music.webp',
    link: 'https://genshin-music.specy.app',
    openSourceLink: 'https://github.com/Specy/genshin-music',
  },
  {
    title: 'Sorcerers',
    kind: 'game',
    author: 'Lorgan3',
    imageUrl: '/showcase/sorcerers.webp',
    link: 'https://lorgan3.itch.io/sorcerers',
    openSourceLink: 'https://github.com/lorgan3/sorcerers',
  },
  {
    title: 'Tailrmade - Your Visual App Builder',
    kind: 'app',
    author: 'Tailrmade.app',
    imageUrl: '/showcase/tailrmadeapp.webp',
    link: 'https://tailrmade.app/',
  },
  {
    title: 'Mergic Pets',
    kind: 'game',
    author: 'Rockstone',
    imageUrl: '/showcase/mergic-pets.webp',
    link: 'https://mergicpets.com/',
  },
  {
    title: 'Benoît Wimart - web design & graphisme',
    kind: 'site',
    author: 'Benoît Wimart',
    imageUrl: '/showcase/jaiunsite-pixijs.webp',
    link: 'https://jaiunsite.com',
  },
  {
    title: 'Suroi',
    kind: 'game',
    author: 'Henry Sanger',
    imageUrl: '/showcase/suroi.webp',
    link: 'https://suroi.io',
  },
  {
    title: 'Happy Wheels',
    kind: 'game',
    author: 'Jim Bonacci / Goodboy Digital',
    imageUrl: '/showcase/happy-wheels.webp',
    link: 'https://totaljerkface.com/happy_wheels.tjf',
  },
  {
    title: 'LEGO City Adventures Build and Protect',
    kind: 'game',
    author: 'Goodboy Digital',
    imageUrl: '/showcase/lego-city-adventures.jpg',
    link: 'https://plays.org/game/lego-city-adventures-build-and-protect/',
  },
  {
    title: 'Subway Surfers',
    kind: 'game',
    author: 'SYBO',
    imageUrl: '/showcase/subway-surfers.webp',
    link: 'https://poki.com/en/g/subway-surfers',
  },
  {
    title: 'Cartoon Network GameBox',
    kind: 'game',
    author: 'Cartoon Network EMEA',
    imageUrl: '/showcase/cartoon-network-gamebox.webp',
    link: 'https://play.google.com/store/apps/details?id=com.turner.cartoonnetworkgames',
  },
  {
    title: 'Right Runner',
    kind: 'game',
    author: 'UNICEF',
    imageUrl: '/showcase/right-runner.webp',
    link: 'https://www.unicef.org/lac/en/right-runner',
  },
  {
    title: 'Defenders of Mathematica',
    kind: 'game',
    author: 'Playerthree',
    imageUrl: '/showcase/guardians_defenders_of_mathematica.jpg',
    link: 'https://www.bbc.co.uk/bitesize/articles/zn2y7nb',
  },
  {
    title: 'GDevelop',
    kind: 'app',
    author: 'GDevelop',
    imageUrl: '/showcase/gdevelop.webp',
    link: 'https://gdevelop.io/',
  },
  {
    title: 'Toon Cup - Football Game',
    kind: 'game',
    author: 'Cartoon Network EMEA',
    imageUrl: '/showcase/toon-cup.webp',
    link: 'https://play.google.com/store/apps/details?id=com.turner.tooncup',
  },
  {
    title: 'Adventure Time Elemental',
    kind: 'game',
    author: 'Cartoon Network EMEA',
    imageUrl: '/showcase/adventure-time-elemental.webp',
    link: 'https://plays.org/game/adventure-time-elemental/',
  },
  {
    title: 'Sprite Fusion',
    kind: 'app',
    author: 'Hugo Duprez',
    imageUrl: '/showcase/sprite-fusion.jpg',
    link: 'https://www.spritefusion.com/',
  },
  {
    title: 'Ember',
    kind: 'app',
    author: 'Ember',
    imageUrl: '/showcase/ember.webp',
    link: 'https://emberdesign.net/',
  },
  {
    title: 'Rendley SDK',
    kind: 'app',
    author: 'Onix Technologies',
    imageUrl: '/showcase/rendley.webp',
    link: 'https://rendley.com/sdk',
  },
];

export const showcaseItems: ShowcaseItem[] = showcaseSourceItems.map(({ sponsor, ...item }) => {
  const sponsoredLink = resolveSponsoredLink(sponsor);

  if (!sponsoredLink) {
    return item;
  }

  return {
    ...item,
    sponsoredLink,
  };
});
