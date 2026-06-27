export type Unit = 'Stck' | 'ml' | 'g' | 'TL' | 'EL' | 'NONE';

interface IngredientDetails {
    unit: string;
    amount: number;
}

export interface Ingredients {
    [ingredientName: string]: IngredientDetails;
}


export interface Amount {
    unit: Unit;
    amount: number;
}

export interface RecipeListItemDTO {
    id: number;
    title: string;
    imageLink?: string;
}

export interface RecipeDetailDTO {
    id: number;
    title: string;
    preparation: string;
    ingredients: Record<string, Amount>; // Map<String, Amount> representation
    authorId: number;
    authorName: string;
    imageLink?: string;
}

export interface IngredientResponseDTO {
    name: string;
    kcalPer100g: number;
}

export interface RecipeRequestDTO {
    title: string;
    preparation: string;
    ingredients: Ingredients;
}

export interface DashboardProps {
    onLogout: () => void;
    token: string;
}

export interface StorageIngredient {
    ingredientName: string;
    amount: number;
    unit: string;
}

export type DashboardView = 'all' | 'search-missing' | 'detail' | 'create' | 'edit';