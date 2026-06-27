import React, { useState, useEffect, type CSSProperties } from 'react';
import { recipeService } from '../service/RecipeService.ts';
import type { RecipeListItemDTO, DashboardView } from '../dtos/types';
import RecipeList from '../components/RecipeList.tsx';
import RecipeDetail from '../components/RecipeDetail.tsx';
import RecipeForm from '../components/RecipeForm.tsx';

interface DashboardProps {
    onLogout: () => void;
    token: string; // Dynamic token passed from login state
}

interface StorageIngredient {
    ingredientName: string;
    amount: number;
    unit: string;
}

export default function Dashboard({ onLogout, token }: DashboardProps): React.JSX.Element {
    const [recipes, setRecipes] = useState<RecipeListItemDTO[]>([]);
    const [storageIngredients, setStorageIngredients] = useState<StorageIngredient[]>([]);
    const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
    const [currentView, setCurrentView] = useState<DashboardView | 'pantry'>('all');
    const [loading, setLoading] = useState<boolean>(false);

    // Form states for adding/updating storage ingredients
    const [newIngName, setNewIngName] = useState('');
    const [newIngAmount, setNewIngAmount] = useState<number>(0);
    const [newIngUnit, setNewIngUnit] = useState('g');

    const loadRecipes = async (): Promise<void> => {
        setLoading(true);
        try {
            const data = await recipeService.getAllRecipes();
            setRecipes(data);
            setCurrentView('all');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadMissingIngredientsSearch = async (): Promise<void> => {
        setLoading(true);
        try {
            const data = await recipeService.findRecipesByIngredients();
            setRecipes(data);
            setCurrentView('search-missing');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadStorageIngredients = async (): Promise<void> => {
        setLoading(true);
        try {
            const data = await recipeService.getStorageIngredients();
            setStorageIngredients(data);
            setCurrentView('pantry');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecipes();
    }, []);

    const handleSelectRecipe = (id: number): void => {
        setSelectedRecipeId(id);
        setCurrentView('detail');
    };

    const handleDelete = async (id: number): Promise<void> => {
        if (window.confirm("Delete this recipe permanently?")) {
            await recipeService.deleteRecipe(id);
            loadRecipes();
        }
    };

    const handleConsumeRecipe = async (id: number): Promise<void> => {
        const multiplierStr = window.prompt("Enter portion multiplier (e.g., 1, 2.5):", "1");
        if (multiplierStr === null) return;

        const multiplier = parseFloat(multiplierStr);
        if (isNaN(multiplier) || multiplier <= 0) {
            alert("Please enter a valid positive number.");
            return;
        }

        try {
            setLoading(true);
            await recipeService.consumeRecipe(id, multiplier);
            alert("Ingredients consumed successfully from storage!");
            loadRecipes();
        } catch (err) {
            console.error(err);
            alert("Failed to consume ingredients. Check if you have enough stock.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveStorageIngredient = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!newIngName.trim()) return;
        try {
            await recipeService.updateStorageIngredient(newIngName.toLowerCase().trim(), {
                amount: newIngAmount,
                unit: newIngUnit
            });
            setNewIngName('');
            setNewIngAmount(0);
            loadStorageIngredients();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteStorageIngredient = async (name: string): Promise<void> => {
        if (window.confirm(`Remove ${name} from storage?`)) {
            try {
                await recipeService.deleteStorageIngredient(name);
                loadStorageIngredients();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const styles = {
        container: {
            display: 'flex',
            height: '100vh',
            width: '100vw',
            maxWidth: '100vw',
            fontFamily: 'sans-serif',
            backgroundColor: '#f8fafc',
            margin: 0,
            padding: 0,
            position: 'fixed',
            top: 0,
            left: 0,
            overflow: 'hidden'
        } as CSSProperties,
        sidebar: {
            width: '240px',
            minWidth: '240px',
            backgroundColor: '#0f172a',
            color: '#fff',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column'
        } as CSSProperties,
        brand: {fontSize: '20px', fontWeight: 'bold', marginBottom: '32px', color: '#10b981'} as CSSProperties,
        nav: {display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1} as CSSProperties,
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
        mainWrapper: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden'
        } as CSSProperties,
        topBar: {
            height: '64px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 32px',
        } as CSSProperties,
        logoutBtn: {
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.2s'
        } as CSSProperties,
        contentArea: {flex: 1, overflowY: 'auto', padding: '32px'} as CSSProperties,
        headerTitle: {fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px 0'} as CSSProperties,
        subTitle: {fontSize: '14px', color: '#64748b', margin: 0, marginBottom: '24px'} as CSSProperties,
        table: {width: '100%', borderCollapse: 'collapse', marginTop: '16px', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'} as CSSProperties,
        th: {backgroundColor: '#f1f5f9', padding: '12px 16px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', color: '#475569', textAlign: 'left'} as CSSProperties,
        td: {padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#334155'} as CSSProperties,
        form: {display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'flex-end', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0'} as CSSProperties,
        inputGroup: {display: 'flex', flexDirection: 'column', gap: '4px'} as CSSProperties,
        input: {padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px'} as CSSProperties,
        actionBtn: {padding: '8px 12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px'} as CSSProperties
    };

    return (
        <div style={styles.container}>
            <aside style={styles.sidebar}>
                <div style={styles.brand}>📖 Recipe Finder</div>
                <nav style={styles.nav}>
                    <button style={styles.navBtn(currentView === 'all')} onClick={loadRecipes}>📋 All Recipes</button>
                    <button style={styles.navBtn(currentView === 'search-missing')} onClick={loadMissingIngredientsSearch}>🔍 Match Pantry</button>
                    <button style={styles.navBtn(currentView === 'pantry')} onClick={loadStorageIngredients}>📦 My Pantry Storage</button>
                    <button style={styles.navBtn(currentView === 'create')} onClick={() => setCurrentView('create')}>➕ Create Recipe</button>
                </nav>
            </aside>

            <div style={styles.mainWrapper}>
                <header style={styles.topBar}>
                    <button style={styles.logoutBtn} onClick={onLogout}>
                        Log Out
                    </button>
                </header>

                <main style={styles.contentArea}>
                    {loading ? (
                        <div style={{color: '#64748b', textAlign: 'center', marginTop: '40px'}}>Loading application content...</div>
                    ) : (
                        <>
                            {(currentView === 'all' || currentView === 'search-missing') && (
                                <div>
                                    <h2 style={styles.headerTitle}>
                                        {currentView === 'all' ? 'Recipe Overview' : 'Smart Match (≤ 2 Missing Ingredients)'}
                                    </h2>
                                    <p style={styles.subTitle}>Found {recipes.length} matching recipes</p>
                                    <RecipeList recipes={recipes} onSelect={handleSelectRecipe}/>
                                </div>
                            )}

                            {currentView === 'pantry' && (
                                <div>
                                    <h2 style={styles.headerTitle}>Pantry Inventory</h2>
                                    <p style={styles.subTitle}>Manage ingredients currently in your physical storage</p>

                                    <form onSubmit={handleSaveStorageIngredient} style={styles.form}>
                                        <div style={styles.inputGroup}>
                                            <label style={{fontSize: '12px', fontWeight: 'bold', color: '#475569'}}>Ingredient Name</label>
                                            <input type="text" placeholder="e.g. flour" value={newIngName} onChange={e => setNewIngName(e.target.value)} style={styles.input} required />
                                        </div>
                                        <div style={styles.inputGroup}>
                                            <label style={{fontSize: '12px', fontWeight: 'bold', color: '#475569'}}>Amount</label>
                                            <input type="number" step="any" placeholder="500" value={newIngAmount} onChange={e => setNewIngAmount(parseFloat(e.target.value) || 0)} style={styles.input} required />
                                        </div>
                                        <div style={styles.inputGroup}>
                                            <label style={{fontSize: '12px', fontWeight: 'bold', color: '#475569'}}>Unit</label>
                                            <input type="text" placeholder="g, ml, Stck" value={newIngUnit} onChange={e => setNewIngUnit(e.target.value)} style={styles.input} required />
                                        </div>
                                        <button type="submit" style={styles.actionBtn}>Add / Update</button>
                                    </form>

                                    <table style={styles.table}>
                                        <thead>
                                        <tr>
                                            <th style={styles.th}>Ingredient</th>
                                            <th style={styles.th}>Available Stock</th>
                                            <th style={styles.th}>Unit</th>
                                            <th style={styles.th}>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {storageIngredients.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} style={{...styles.td, textAlign: 'center', color: '#94a3b8'}}>Your storage is empty. Add ingredients above.</td>
                                            </tr>
                                        ) : (
                                            storageIngredients.map((ing) => (
                                                <tr key={ing.ingredientName}>
                                                    <td style={{...styles.td, fontWeight: 'bold'}}>{ing.ingredientName}</td>
                                                    <td style={styles.td}>{ing.amount}</td>
                                                    <td style={styles.td}>{ing.unit}</td>
                                                    <td style={styles.td}>
                                                        <button
                                                            style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px'}}
                                                            onClick={() => handleDeleteStorageIngredient(ing.ingredientName)}
                                                        >
                                                            🗑️ Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {currentView === 'detail' && selectedRecipeId !== null && (
                                <div>
                                    <div style={{display: 'flex', gap: '12px', marginBottom: '16px'}}>
                                        <button
                                            style={{...styles.actionBtn, backgroundColor: '#6366f1'}}
                                            onClick={() => handleConsumeRecipe(selectedRecipeId)}
                                        >
                                            🍽️ Consume Ingredients
                                        </button>
                                    </div>
                                    <RecipeDetail id={selectedRecipeId} token={token} onBack={loadRecipes}
                                                  onEdit={() => setCurrentView('edit')} onDelete={handleDelete}/>
                                </div>
                            )}

                            {currentView === 'create' && (
                                <RecipeForm token={token} onSave={loadRecipes} onCancel={loadRecipes} recipeId={undefined}/>
                            )}

                            {currentView === 'edit' && selectedRecipeId !== null && (
                                <RecipeForm token={token} recipeId={selectedRecipeId} onSave={loadRecipes}
                                            onCancel={() => setCurrentView('detail')}/>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}