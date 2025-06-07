import { useEffect, useState } from 'react';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import { examples } from './config';
import styles from './examples.module.css';
import { useLocalStorage } from './hooks/useLocalStorage';
import { filterItems } from './utils/searchUtils';
import { useHistory, useLocation } from '@docusaurus/router';

import type { Item } from './types';

export default function Examples(): JSX.Element
{
    const location = useLocation();
    const history = useHistory();

    const [searchTerm, setSearchTerm] = useState('');
    const [showGifs, setShowGifs] = useLocalStorage('showGifs', false);
    const [compactView, setCompactView] = useLocalStorage('compactView', false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filteredItems, setFilteredItems] = useState<Item[]>(examples as Item[]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    // Read example from URL on mount and when URL changes
    useEffect(() =>
    {
        const params = new URLSearchParams(location.search);
        const exampleName = params.get('example');

        if (exampleName)
        {
            const found = examples.find((item) => item.name === exampleName) as Item | undefined;

            setSelectedItem(found || null);
        }
        else
        {
            setSelectedItem(null);
        }
    }, [location]);

    useEffect(() =>
    {
        const filtered = filterItems(examples as Item[], searchTerm);

        setFilteredItems(filtered);
    }, [searchTerm]);

    const handleSelectExample = (item: Item) =>
    {
    // dont set selected item if already selected
        if (selectedItem && selectedItem.name === item.name)
        {
            return;
        }
        setSelectedItem(item);
        const params = new URLSearchParams(location.search);

        params.set('example', item.name);
        history.push({ search: params.toString() });
    };

    const handleSearchChange = (value: string) =>
    {
        setSearchTerm(value);
    };

    const handleGifToggle = (value: boolean) =>
    {
        setShowGifs(value);
    };

    const handleCompactToggle = (value: boolean) =>
    {
        setCompactView(value);
    };

    const toggleSidebar = () =>
    {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className={styles.app}>
            <Sidebar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                showGifs={showGifs}
                onGifToggle={handleGifToggle}
                compactView={compactView}
                onCompactToggle={handleCompactToggle}
                isOpen={sidebarOpen}
                onToggle={toggleSidebar}
                filteredItems={filteredItems}
                onSelectExample={handleSelectExample}
            />
            <MainContent selectedItem={selectedItem} />
            {sidebarOpen && <div className={`${styles.overlay}`} onClick={toggleSidebar} />}
        </div>
    );
}
