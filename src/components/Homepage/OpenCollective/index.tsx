import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './index.module.scss';

interface OpenCollectiveData {
    MemberId: number;
    createdAt: string;
    type: string;
    role: string;
    isActive: boolean;
    totalAmountDonated: number;
    currency?: string;
    lastTransactionAt: string;
    lastTransactionAmount: number;
    profile: string;
    name: string;
    company?: string;
    description?: string;
    image?: string;
    twitter?: string;
    github?: string;
    website?: string;
    email: any;
    tier?: string;
}
type OpenCollectiveSchema = OpenCollectiveData[];

interface SponsorData {
    name: string;
    image: string;
    website: string;
}
const animShortUp = (duration: number, delay: number) => ({
    opacity: 0,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
});

export default function OpenCollective(): JSX.Element
{
    const [sponsors, setSponsors] = useState<SponsorData[]>([]);

    useEffect(() =>
    {
        async function fetchSponsors()
        {
            const response = await fetch('https://opencollective.com/pixijs/members/all.json');
            const data = (await response.json()) as OpenCollectiveSchema;
            const sponsorData = data
                .filter((member) => member.tier === 'sponsor')
                .filter((member) => member.isActive)
                .sort((a, b) => b.totalAmountDonated - a.totalAmountDonated)
                .map((member) => ({
                    name: member.name,
                    image: member.image,
                    website: member.website,
                }));

            const playco = {
                name: 'Playco',
                image: '/images/logo-playco.png',
                website: 'https://www.play.co/',
            };

            sponsorData.unshift(playco);

            setSponsors(sponsorData as SponsorData[]);
        }
        fetchSponsors();
    }, []);

    const [ref, inView] = useInView({
        triggerOnce: true,
    });

    return (
        <div className={`${styles.wrapper}`}>
            <div ref={ref}>
                {inView && (
                    <>
                        <h3 className={`${styles.title} underline short-up-anim`} style={animShortUp(0.3, 0.25)}>
                            Sponsors
                        </h3>
                        <h5 className={`${styles.subtitle} short-up-anim`} style={animShortUp(0.3, 0.4)}>
                            These contributors support PixiJS financially, which allows us to spend more time working on
                            PixiJS.
                        </h5>
                        <div className={`${styles.sponsorGrid} short-up-anim`} style={animShortUp(0.3, 0.55)}>
                            {sponsors.map((sponsor) => (
                                <div key={sponsor.name} className={styles.sponsor}>
                                    <a href={sponsor.website}>
                                        <img
                                            src={sponsor.image}
                                            alt={`${sponsor.name} logo`}
                                            className={styles.sponsorImage}
                                        />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
