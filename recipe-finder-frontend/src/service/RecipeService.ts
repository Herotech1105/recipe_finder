import type { RecipeListItemDTO, RecipeDetailDTO, IngredientResponseDTO, RecipeRequestDTO } from '../dtos/types.ts';

const BASE_URL = '/api/recipes';

const getHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const recipeService = {
    getAllRecipes: async (): Promise<RecipeListItemDTO[]> => {
        const res = await fetch(BASE_URL, { headers: getHeaders() });
        return res.json() as Promise<RecipeListItemDTO[]>;
    },

    getRecipeById: async (id: number): Promise<RecipeDetailDTO> => {
        const res = await fetch(`${BASE_URL}/${id}`, { headers: getHeaders() });
        return res.json() as Promise<RecipeDetailDTO>;
    },

    getNutritionById: async (id: number): Promise<IngredientResponseDTO[]> => {
        const res = await fetch(`${BASE_URL}/${id}/nutrition`, { headers: getHeaders() });
        return res.json() as Promise<IngredientResponseDTO[]>;
    },

    findRecipesByIngredients: async (): Promise<RecipeListItemDTO[]> => {
        const res = await fetch(`${BASE_URL}/find`, { headers: getHeaders() });
        return res.json() as Promise<RecipeListItemDTO[]>;
    },

    // Fixed: Removed the trailing comma after recipeData
    createRecipe: async (recipeData: RecipeRequestDTO): Promise<void> => {
        console.log(JSON.stringify(recipeData));
        await fetch(BASE_URL, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(recipeData),
        });
    },

    updateRecipe: async (id: number, recipeData: RecipeRequestDTO): Promise<void> => {
        await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(recipeData),
        });
    },

    deleteRecipe: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
    }
};