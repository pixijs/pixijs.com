import { useThemeConfig } from '@docusaurus/theme-common';
import { splitNavbarItems } from '@docusaurus/theme-common/internal';
import NavbarItem from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import SearchBar from '@theme/SearchBar';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import NavbarLogo from '@theme/Navbar/Logo';
import NavbarSearch from '@theme/Navbar/Search';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

function useNavbarItems()
{
    // TODO temporary casting until ThemeConfig type is improved
    return useThemeConfig().navbar.items;
}

// TODO: add prop-types and/or convert to TS!
// eslint-disable-next-line react/prop-types
function NavbarItems({ items })
{
    return (
        <>
            {/* eslint-disable-next-line react/prop-types */}
            {items.map((item, i) => (
                <NavbarItem {...item} key={i} />
            ))}
        </>
    );
}

// TODO: add prop-types and/or convert to TS!
// eslint-disable-next-line react/prop-types
function NavbarContentLayout({ left, right })
{
    return (
        <div className="navbar__inner">
            <div className="navbar__items">{left}</div>
            <div className="navbar__items navbar__items--right">{right}</div>
        </div>
    );
}

export default function NavbarContent()
{
    const items = useNavbarItems();
    const [leftItems, rightItems] = splitNavbarItems(items);
    const searchBarItem = items.find((item) => item.type === 'search');
    const navItems = [];
    const socialItems = [];

    const isBrowser = useIsBrowser();
    const socialsThreshold = 1423;
    const searchThreshold = 1479;
    const mobileThreshold = 996;

    const [navbar, setNavbar] = useState({
        socials: isBrowser ? window.innerWidth > socialsThreshold : true,
        search: isBrowser ? window.innerWidth > searchThreshold : true,
        mobile: isBrowser ? window.innerWidth < mobileThreshold : false,
    });

    const resetEditorLayout = () =>
    {
        setNavbar({
            socials: window.innerWidth > socialsThreshold,
            search: window.innerWidth > searchThreshold,
            mobile: window.innerWidth < mobileThreshold,
        });
    };

    useEffect(() =>
    {
        window.addEventListener('resize', resetEditorLayout);

        return () =>
        {
            window.removeEventListener('resize', resetEditorLayout);
        };
    }, [navbar]);

    useEffect(() =>
    {
        resetEditorLayout();
    }, []);

    rightItems.forEach((item) =>
    {
        if (item.className?.includes('header-link')) socialItems.push(item);
        else navItems.push(item);
    });

    return (
        <NavbarContentLayout
            left={
                // TODO stop hardcoding items?
                <>
                    {navbar.mobile && <NavbarMobileSidebarToggle />}
                    <NavbarLogo />
                    <NavbarItems items={leftItems} />
                </>
            }
            right={
                // TODO stop hardcoding items?
                // Ask the user to add the respective navbar items => more flexible
                <>
                    {!searchBarItem && (
                        <NavbarSearch className={`${!navbar.search ? styles['short-search'] : ''}`}>
                            <SearchBar />
                        </NavbarSearch>
                    )}
                    <span className={styles.separator} />
                    <NavbarItems items={navItems} />
                    <span className={styles.separator} />
                    <NavbarColorModeToggle className={styles.colorModeToggle} />
                    {navbar.socials && <span className={styles.separator} />}
                    {navbar.socials && <NavbarItems items={socialItems} />}
                </>
            }
        />
    );
}
