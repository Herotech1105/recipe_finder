import React, { type CSSProperties } from 'react';
import { type DashboardView } from '../dtos/types';

interface SidebarProps {
    currentView: DashboardView | 'pantry';
    onNavigateAll: () => void;
    onNavigateMissing: () => void;
    onNavigatePantry: () => void;
    onNavigateCreate: () => void;
}

export default function Sidebar({
                                    currentView,
                                    onNavigateAll,
                                    onNavigateMissing,
                                    onNavigatePantry,
                                    onNavigateCreate,
                                }: SidebarProps): React.JSX.Element {
    return (
        <aside style={styles.sidebar}>
            <div style={styles.brand}>📖 Recipe Finder</div>
            <nav style={styles.nav}>
                <button style={styles.navBtn(currentView === 'all')} onClick={onNavigateAll}>📋 All Recipes</button>
                <button style={styles.navBtn(currentView === 'search-missing')} onClick={onNavigateMissing}>🔍 Match Pantry</button>
                <button style={styles.navBtn(currentView === 'pantry')} onClick={onNavigatePantry}>📦 My Pantry Storage</button>
                <button style={styles.navBtn(currentView === 'create')} onClick={onNavigateCreate}>➕ Create Recipe</button>
            </nav>
        </aside>
    );
}

const styles = {
    sidebar: {
        width: '240px',
        minWidth: '240px',
        backgroundColor: '#0f172a',
        color: '#fff',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column'
    } as CSSProperties,
    brand: { fontSize: '20px', fontWeight: 'bold', marginBottom: '32px', color: '#10b981' } as CSSProperties,
    nav: { display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 } as CSSProperties,
    navBtn: (isActive: boolean): CSSProperties => ({
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: 'none',
        background: isActive ? '#059669' : 'transparent',
        color: isActive ? '#fff' : '#94a3b8',
        textAlign: 'left',
        fontWeight: '500',
        cursor: 'pointer',
        fontSize: '14px'
    }),
};