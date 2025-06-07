import styles from '../examples.module.css';

import type React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) =>
    (
        <div className={`${styles['toggle-switch"']}`}>
            <label className={`${styles['toggle-switch__label']}`}>
                <input
                    type="checkbox"
                    className={`${styles['toggle-switch__input']}`}
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span className={`${styles['toggle-switch__slider']}`}></span>
                <span className={`${styles['toggle-switch__text']}`}>{label}</span>
            </label>
        </div>
    );

export default ToggleSwitch;
