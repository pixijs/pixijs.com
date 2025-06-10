/* eslint-disable react/prop-types */
import DocSidebarItem from '@theme-original/DocSidebarItem';

/**
 * @typedef {Object} DocSidebarItemProps
 * @property {Object} item - The sidebar item object.
 * @property {string} item.type - The type of the sidebar item.
 * @property {string} item.href - The href of the sidebar item.
 * @property {number} level - The level of the sidebar item.
 * @property {string} activePath - The current active path.
 */

/**
 * DocSidebarItemWrapper component
 * @param {DocSidebarItemProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered component.
 */
export default function DocSidebarItemWrapper(props) {
  let color = props.item.type === 'category' && props.level === 1 ? 'var(--sidebar-category-color)' : 'grey';

  if (props.activePath === props.item.href) {
    color = 'var(--ifm-color-primary)';
  }

  return (
    <>
      <DocSidebarItem {...props} style={{ fontSize: '14px', marginTop: '0px', color }} />
    </>
  );
}
