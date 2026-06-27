import React, {useState, useEffect} from 'react';
import {recipeService} from '../service/RecipeService.ts';
import type {RecipeDetailDTO, IngredientResponseDTO} from '../dtos/types.ts';
import {recipeDetailStyles} from "../styles/componentStyles.ts";

interface RecipeDetailProps {
    id: number;
    token: string;
    onBack: () => void;
    onEdit: () => void;
    onDelete: (id: number) => void;
}

export default function RecipeDetail({id, onBack, onEdit, onDelete}: RecipeDetailProps): React.JSX.Element {
    const [recipe, setRecipe] = useState<RecipeDetailDTO | null>(null);
    const [nutrition, setNutrition] = useState<IngredientResponseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchDetails(): Promise<void> {
            try {
                const detail = await recipeService.getRecipeById(id);
                setRecipe(detail);
                const nutr = await recipeService.getNutritionById(id);
                setNutrition(nutr);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchDetails();
    }, [id]);



    if (loading) return <div style={{textAlign: 'center', color: '#64748b'}}>Loading content...</div>;
    if (!recipe) return <div style={{textAlign: 'center', color: '#dc2626'}}>Recipe not found.</div>;

    return (
        <div style={recipeDetailStyles.wrapper}>
            <div style={recipeDetailStyles.actionBar}>
                <button style={recipeDetailStyles.backBtn} onClick={onBack}>← Back</button>
                <div style={recipeDetailStyles.actionGroup}>
                    <button style={recipeDetailStyles.editBtn} onClick={onEdit}>✏️ Edit</button>
                    <button style={recipeDetailStyles.delBtn} onClick={() => onDelete(recipe.id)}>🗑️ Delete</button>
                </div>
            </div>

            <img src={recipe.imageLink || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800"}
                 alt={recipe.title} style={recipeDetailStyles.img}/>

            <div style={recipeDetailStyles.content}>
                <h1 style={recipeDetailStyles.title}>{recipe.title}</h1>
                <p style={recipeDetailStyles.author}>By {recipe.authorName || `Author ID: ${recipe.authorId}`}</p>

                <div style={recipeDetailStyles.grid}>
                    <div>
                        <h3 style={recipeDetailStyles.sectionTitle}>Ingredients</h3>
                        <ul style={recipeDetailStyles.list}>
                            {Object.entries(recipe.ingredients || {}).map(([name, amt]) => (
                                <li key={name} style={recipeDetailStyles.listItem}>
                                    <strong>{name}</strong>
                                    <span>{amt.amount} {amt.unit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 style={{...recipeDetailStyles.sectionTitle, color: '#065f46'}}>🥗 Nutrition Facts</h3>
                        {nutrition.length === 0 ? <p style={{fontSize: '12px', color: '#94a3b8'}}>None provided.</p> : (
                            <table style={recipeDetailStyles.table}>
                                <tbody>
                                {nutrition.map((item, i) => (
                                    <tr key={i}>
                                        <td style={recipeDetailStyles.tableCell}>{item.name}</td>
                                        <td style={{
                                            ...recipeDetailStyles.tableCell,
                                            textAlign: 'right',
                                            fontWeight: '500'
                                        }}>{item.kcalPer100g} kcal/100g
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div style={recipeDetailStyles.prepBox}>
                    <h3 style={recipeDetailStyles.sectionTitle}>Preparation Instructions</h3>
                    <p style={{
                        color: '#334155',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap',
                        fontSize: '15px'
                    }}>{recipe.preparation}</p>
                </div>
            </div>
        </div>
    );
}