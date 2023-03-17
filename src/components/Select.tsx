import type { ChangeEvent, HTMLAttributes } from 'react';
import { useCallback } from 'react';
import classNames from 'classnames';

import styles from './Select.module.scss';

export type Option = {
    label: string;
    value: string;
};

export type OptionGroup = {
    label: string;
    options: Option[];
};

type SelectProps = HTMLAttributes<HTMLSelectElement> & {
    selectedId: string;
    options: Option[] | OptionGroup[];
    onValueChange: (id: string) => void;
};

const isOptionGroup = (options: Option[] | OptionGroup[]): options is OptionGroup[] =>
    options.length > 0 && Array.isArray((options[0] as OptionGroup).options);

const mapOptions = (options: Option[]) =>
    options.map(({ value, label }) => (
        <option key={value} value={value}>
            {label}
        </option>
    ));

const mapOptionGroups = (optionGroups: OptionGroup[]) =>
    optionGroups.map(({ label, options }) => (
        <optgroup key={label} label={label}>
            {mapOptions(options)}
        </optgroup>
    ));

// TODO: use third party library? material or ant?
export default function Select({ className, selectedId, options, onValueChange, ...rest }: SelectProps)
{
    const onChange = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) =>
        {
            onValueChange(e.target.value);
        },
        [onValueChange],
    );

    const isGroup = isOptionGroup(options);

    return (
        <select className={classNames(styles.select, className)} {...rest} value={selectedId} onChange={onChange}>
            {isGroup && mapOptionGroups(options)}
            {!isGroup && mapOptions(options)}
        </select>
    );
}
