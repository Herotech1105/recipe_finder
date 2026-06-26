import React, {useState, useEffect, type CSSProperties} from 'react';
import {recipeService} from './RecipeService';
import type {RecipeListItemDTO, DashboardView} from '../dtos/types';
import RecipeList from './RecipeList';
import RecipeDetail from './RecipeDetail';
import RecipeForm from './RecipeForm';

export default function Dashboard(): React.JSX.Element {
    const [recipes, setRecipes] = useState<RecipeListItemDTO[]>([]);
    const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
    const [currentView, setCurrentView] = useState<DashboardView>('all');
    const [loading, setLoading] = useState<boolean>(false);
    const [token] = useState<string>("YOUR_JWT_TOKEN_HERE");

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

    const styles = {
        container: {
            display: 'flex',
            height: '100vh',
            fontFamily: 'sans-serif',
            backgroundColor: '#f8fafc',
            margin: 0
        } as CSSProperties,
        sidebar: {
            width: '240px',
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
        main: {flex: 1, overflowY: 'auto', padding: '32px'} as CSSProperties,
        headerTitle: {fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px 0'} as CSSProperties,
        subTitle: {fontSize: '14px', color: '#64748b', margin: 0, marginBottom: '24px'} as CSSProperties
    };

    return (
        <div style={styles.container}>
            <aside style={styles.sidebar}>
                <div style={styles.brand}>📖 InnoRecipes</div>
                <nav style={styles.nav}>
                    <button style={styles.navBtn(currentView === 'all')} onClick={loadRecipes}>📋 All Recipes</button>
                    <button style={styles.navBtn(currentView === 'search-missing')}
                            onClick={loadMissingIngredientsSearch}>🔍 Match Pantry
                    </button>
                    <button style={styles.navBtn(currentView === 'create')} onClick={() => setCurrentView('create')}>➕
                        Create Recipe
                    </button>
                </nav>
            </aside>

            <main style={styles.main}>
                {loading ? (
                    <div style={{color: '#64748b', textAlign: 'center', marginTop: '40px'}}>Loading application
                        content...</div>
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

                        {currentView === 'detail' && selectedRecipeId !== null && (
                            <RecipeDetail id={selectedRecipeId} token={token} onBack={loadRecipes}
                                          onEdit={() => setCurrentView('edit')} onDelete={handleDelete}/>
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
    );
}