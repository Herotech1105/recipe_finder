import type { RecipeListItemDTO, RecipeDetailDTO, IngredientResponseDTO, RecipeRequestDTO } from '../dtos/types.ts';

const RECIPE_URL = '/api/recipes';
const STORAGE_URL = '/api/storage';

export interface StorageIngredientDTO {
    ingredientName: string;
    amount: number;
    unit: string;
}

export interface StorageIngredientRequest {
    amount: number;
    unit: string;
}

const getHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const recipeService = {
    getAllRecipes: async (): Promise<RecipeListItemDTO[]> => {
        const res = await fetch(RECIPE_URL, { headers: getHeaders() });
        return res.json() as Promise<RecipeListItemDTO[]>;
    },

    getRecipeById: async (id: number): Promise<RecipeDetailDTO> => {
        const res = await fetch(`${RECIPE_URL}/${id}`, { headers: getHeaders() });
        return res.json() as Promise<RecipeDetailDTO>;
    },

    getNutritionById: async (id: number): Promise<IngredientResponseDTO[]> => {
        const res = await fetch(`${RECIPE_URL}/${id}/nutrition`, { headers: getHeaders() });
        return res.json() as Promise<IngredientResponseDTO[]>;
    },

    findRecipesByIngredients: async (): Promise<RecipeListItemDTO[]> => {
        const res = await fetch(`${RECIPE_URL}/find`, { headers: getHeaders() });
        return res.json() as Promise<RecipeListItemDTO[]>;
    },

    createRecipe: async (recipeData: RecipeRequestDTO): Promise<void> => {
        console.log(JSON.stringify(recipeData));
        await fetch(RECIPE_URL, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(recipeData),
        });
    },

    updateRecipe: async (id: number, recipeData: RecipeRequestDTO): Promise<void> => {
        await fetch(`${RECIPE_URL}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(recipeData),
        });
    },

    deleteRecipe: async (id: number): Promise<void> => {
        await fetch(`${RECIPE_URL}/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
    },

    getStorageIngredients: async (): Promise<StorageIngredientDTO[]> => {
        const res = await fetch(`${STORAGE_URL}/ingredients`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch storage inventory');
        return res.json() as Promise<StorageIngredientDTO[]>;
    },

    updateStorageIngredient: async (name: string, data: StorageIngredientRequest): Promise<void> => {
        const res = await fetch(`${STORAGE_URL}/ingredients/${encodeURIComponent(name)}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`Failed to update ingredient: ${name}`);
    },

    deleteStorageIngredient: async (name: string): Promise<void> => {
        const res = await fetch(`${STORAGE_URL}/ingredients/${encodeURIComponent(name)}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(`Failed to remove ingredient: ${name}`);
    },

    consumeRecipe: async (id: number, multiplier?: number): Promise<void> => {
        const url = multiplier !== undefined
            ? `${STORAGE_URL}/consume-recipe/${id}?multiplier=${multiplier}`
            : `${STORAGE_URL}/consume-recipe/${id}`;

        const res = await fetch(url, {
            method: 'POST',
            headers: getHeaders()
        });

        if (!res.ok) {
            throw new Error('Failed to consume recipe ingredients. Inventory might be insufficient.');
        }
    }
};