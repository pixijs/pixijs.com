import { useThemeConfig } from '@docusaurus/theme-common';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import NavbarItem from '@theme/NavbarItem';
import styles from './styles.module.scss';

function useNavbarItems()
{
    // TODO temporary casting until ThemeConfig type is improved
    return useThemeConfig().navbar.items;
}

// The primary menu displays the navbar items
export default function NavbarMobilePrimaryMenu()
{
    const mobileSidebar = useNavbarMobileSidebar();
    // TODO how can the order be defined for mobile?
    // Should we allow providing a different list of items?
    const items = useNavbarItems();
    const navItems = [];
    const socialItems = [];

    items.forEach((item) =>
    {
        if (item.className?.includes('header-link')) socialItems.push(item);
        else navItems.push(item);
    });

    return (
        <ul className="menu__list">
            {navItems.map((item, i) => (
                <NavbarItem mobile {...item} onClick={() => mobileSidebar.toggle()} key={i} />
            ))}
            <li className={styles.separator} />
            <li className={styles.socialItems}>
                {socialItems.map((item, i) => (
                    <NavbarItem mobile {...item} onClick={() => mobileSidebar.toggle()} key={i} />
                ))}
            </li>
        </ul>
    );
}
