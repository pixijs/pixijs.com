import styles from './index.module.scss';
import content from './content.json';
import graphics from './graphics.json';

export default function KeyOfferings(): JSX.Element
{
    return (
        <div className={`padding-vert--lg ${styles.highlights}`}>
            <div className="container flex">
                {content.map((item, index) => (
                    <div key={index} className="col col--4 padding-vert--md">
                        <span>{`0${index + 1}`}</span>
                        <h2 className="underline">{item.heading}</h2>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
            <div className={styles.devices}>
                {graphics.devices.map((device, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            ...device.styles,
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
                ))}
            </div>
        </div>
    );
}
