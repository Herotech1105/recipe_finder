export type Unit = 'GRAM' | 'KILOGRAM' | 'LITER' | 'MILLILITER' | 'PIECE';

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
    ingredients: Record<string, Amount>; // Map represented by dynamic serialized object payload
    imageLink?: string;
}

export interface IngredientRow {
    name: string;
    unit: Unit;
    amount: number;
}

export type DashboardView = 'all' | 'search-missing' | 'detail' | 'create' | 'edit';