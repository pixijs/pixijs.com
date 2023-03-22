import styles from './index.module.scss';
import content from './content.json';
import graphics from './graphics.json';
import { useInView } from 'react-intersection-observer';

const Offerings = (): JSX.Element =>
{
    const { ref, inView } = useInView({
        triggerOnce: true,
    });

    return (
        <div ref={ref} className={`container flex`}>
            {content.map((item, index) =>
            {
                if (!inView)
                {
                    return null;
                }

                return (
                    <div
                        key={index}
                        className="col col--4 padding-vert--md"
                        style={{
                            transform: 'translateX(100vw)',
                            animation: `offering-in 1s cubic-bezier(0.215, 0.61, 0.355, 1) ${Number(
                                0.15 * index,
                            )}s forwards`,
                        }}
                    >
                        <span>{`0${index + 1}`}</span>
                        <h2 className="underline">{item.heading}</h2>
                        <p>{item.description}</p>
                    </div>
                );
            })}
        </div>
    );
};

const Devices = (): JSX.Element =>
{
    const { ref, inView } = useInView({
        triggerOnce: true,
    });

    return (
        <div ref={ref} className={styles.devices}>
            {graphics.devices.map((device, index) =>
            {
                const delay = device.styles.dataDelay;

                if (!inView)
                {
                    return null;
                }

                return (
                    <div
                        key={index}
                        style={{
                            ...device.styles,
                            position: 'absolute',
                            animation: `device-in 0.4s cubic-bezier(0.215, 0.61, 0.355, 1) ${delay}s forwards`,
                        }}
                    >
                        <img src={device.img} alt={device.alt} />
                        <canvas
                            style={{
                                position: 'absolute',
                                background: `#ecedf1 url(${graphics.canvasImg}) center center`,
                                border: '1px solid #b1b8c4',
                                ...device.canvas,
                            }}
                        ></canvas>
                    </div>
                );
            })}
        </div>
    );
};

export default function KeyOfferings(): JSX.Element
{
    return (
        <div
            className={`padding-vert--lg ${styles.highlights} features`}
            style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            }}
        >
            <Offerings />
            <Devices />
        </div>
    );
}
