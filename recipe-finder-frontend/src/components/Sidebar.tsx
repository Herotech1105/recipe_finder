import { type DashboardView } from '../dtos/types';
import {sidebarStyles} from "../styles/componentStyles.ts";

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
        <aside style={sidebarStyles.sidebar}>
            <div style={sidebarStyles.brand}>📖 Recipe Finder</div>
            <nav style={sidebarStyles.nav}>
                <button style={sidebarStyles.navBtn(currentView === 'all')} onClick={onNavigateAll}>📋 All Recipes</button>
                <button style={sidebarStyles.navBtn(currentView === 'search-missing')} onClick={onNavigateMissing}>🔍 Match Pantry</button>
                <button style={sidebarStyles.navBtn(currentView === 'pantry')} onClick={onNavigatePantry}>📦 My Pantry Storage</button>
                <button style={sidebarStyles.navBtn(currentView === 'create')} onClick={onNavigateCreate}>➕ Create Recipe</button>
            </nav>
        </aside>
    );
}
