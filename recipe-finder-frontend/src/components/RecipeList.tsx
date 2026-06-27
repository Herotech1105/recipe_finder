import type {RecipeListItemDTO} from '../dtos/types.ts';
import {recipeListStyles} from '../styles/componentStyles.ts'

interface RecipeListProps {
    recipes: RecipeListItemDTO[];
    onSelect: (id: number) => void;
}

export default function RecipeList({ recipes, onSelect }: RecipeListProps): React.JSX.Element {

    if (recipes.length === 0) {
        return <div style={{ textAlign: 'center', color: '#64748b', padding: '48px', border: '2px dashed #cbd5e1', borderRadius: '12px' }}>No recipes listed.</div>;
    }

    return (
        <div style={recipeListStyles.grid}>
            {recipes.map(recipe => (
                <div key={recipe.id} style={recipeListStyles.card}>
                    <img src={recipe.imageLink || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400"} alt={recipe.title} style={recipeListStyles.img} />
                    <div style={recipeListStyles.body}>
                        <h3 style={recipeListStyles.title}>{recipe.title}</h3>
                        <button style={recipeListStyles.btn} onClick={() => onSelect(recipe.id)}>👁️ View Details</button>
                    </div>
                </div>
            ))}
        </div>
    );
}