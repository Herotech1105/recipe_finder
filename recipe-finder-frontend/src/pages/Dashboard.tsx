import React, { useState, useEffect } from 'react';
import { recipeService } from '../service/RecipeService.ts';
import type { RecipeListItemDTO, DashboardView } from '../dtos/types';
import type { DashboardProps, StorageIngredient } from '../dtos/types.ts';
import RecipeList from '../components/RecipeList.tsx';
import RecipeDetail from '../components/RecipeDetail.tsx';
import RecipeForm from '../components/RecipeForm.tsx';
import Sidebar from '../components/Sidebar.tsx';
import PantryInventory from '../components/PantryInventory.tsx';
import {dashBoardStyles} from "../styles/pagesStyles.ts";

export default function Dashboard({ onLogout, token }: DashboardProps): React.JSX.Element {
    const [recipes, setRecipes] = useState<RecipeListItemDTO[]>([]);
    const [storageIngredients, setStorageIngredients] = useState<StorageIngredient[]>([]);
    const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
    const [currentView, setCurrentView] = useState<DashboardView | 'pantry'>('all');
    const [loading, setLoading] = useState<boolean>(false);

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

    const handleSaveStorageIngredient = async (name: string, amount: number, unit: string): Promise<void> => {
        try {
            await recipeService.updateStorageIngredient(name, { amount, unit });
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

    return (
        <div style={dashBoardStyles.container}>
            <Sidebar
                currentView={currentView}
                onNavigateAll={loadRecipes}
                onNavigateMissing={loadMissingIngredientsSearch}
                onNavigatePantry={loadStorageIngredients}
                onNavigateCreate={() => setCurrentView('create')}
            />

            <div style={dashBoardStyles.mainWrapper}>
                <header style={dashBoardStyles.topBar}>
                    <button style={dashBoardStyles.logoutBtn} onClick={onLogout}>Log Out</button>
                </header>

                <main style={dashBoardStyles.contentArea}>
                    {loading ? (
                        <div style={dashBoardStyles.loadingText}>Loading application content...</div>
                    ) : (
                        <>
                            {(currentView === 'all' || currentView === 'search-missing') && (
                                <div>
                                    <h2 style={dashBoardStyles.headerTitle}>
                                        {currentView === 'all' ? 'Recipe Overview' : 'Smart Match (≤ 2 Missing Ingredients)'}
                                    </h2>
                                    <p style={dashBoardStyles.subTitle}>Found {recipes.length} matching recipes</p>
                                    <RecipeList recipes={recipes} onSelect={handleSelectRecipe}/>
                                </div>
                            )}

                            {currentView === 'pantry' && (
                                <PantryInventory
                                    storageIngredients={storageIngredients}
                                    onSaveIngredient={handleSaveStorageIngredient}
                                    onDeleteIngredient={handleDeleteStorageIngredient}
                                />
                            )}

                            {currentView === 'detail' && selectedRecipeId !== null && (
                                <div>
                                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                        <button style={dashBoardStyles.consumeBtn} onClick={() => handleConsumeRecipe(selectedRecipeId)}>
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
