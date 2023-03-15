import styles from './index.module.scss';
import features from './features.json';

export default function FeatureList(): JSX.Element
{
  return (
    <div className={`${styles.wrapper} padding--md padding-vert--xl`}>
      <div className="col col--12 margin-bottom--lg">
        <h2 className={`${styles.title} underline`}>PixiJS Features</h2>
      </div>
      <div className={`row ${styles.features}`}>
        {features.map((feature, index) => (
          <div key={index} className={`${styles.feature} col col--6`}>
            <img src={feature.icon} />
            <div>
              <h6>{feature.heading}</h6>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
