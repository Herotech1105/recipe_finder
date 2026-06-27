import React, {useState, useEffect, type CSSProperties} from 'react';
import {recipeService} from '../service/RecipeService.ts';
import type {RecipeDetailDTO, IngredientResponseDTO} from '../dtos/types.ts';

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

    const styles = {
        wrapper: {
            maxWidth: '800px',
            margin: '0 auto',
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
        } as CSSProperties,
        actionBar: {
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        } as CSSProperties,
        backBtn: {
            background: 'none',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            fontWeight: '500'
        } as CSSProperties,
        actionGroup: {display: 'flex', gap: '8px'} as CSSProperties,
        editBtn: {
            padding: '6px 12px',
            backgroundColor: '#fef3c7',
            color: '#d97706',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
        } as CSSProperties,
        delBtn: {
            padding: '6px 12px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
        } as CSSProperties,
        img: {width: '100%', height: '260px', objectFit: 'cover'} as CSSProperties,
        content: {padding: '32px'} as CSSProperties,
        title: {fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#0f172a'} as CSSProperties,
        author: {fontSize: '14px', color: '#64748b', margin: '0 0 24px 0'} as CSSProperties,
        grid: {display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px'} as CSSProperties,
        sectionTitle: {
            fontSize: '18px',
            fontWeight: '600',
            borderBottom: '2px solid #f1f5f9',
            paddingBottom: '8px',
            margin: '0 0 12px 0'
        } as CSSProperties,
        list: {listStyle: 'none', padding: 0, margin: 0} as CSSProperties,
        listItem: {
            padding: '10px 0',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px'
        } as CSSProperties,
        table: {width: '100%', borderCollapse: 'collapse', fontSize: '14px'} as CSSProperties,
        tableCell: {padding: '8px 0', borderBottom: '1px solid #f1f5f9'} as CSSProperties,
        prepBox: {marginTop: '32px', borderTop: '2px solid #f1f5f9', paddingTop: '24px'} as CSSProperties
    };

    if (loading) return <div style={{textAlign: 'center', color: '#64748b'}}>Loading content...</div>;
    if (!recipe) return <div style={{textAlign: 'center', color: '#dc2626'}}>Recipe not found.</div>;

    return (
        <div style={styles.wrapper}>
            <div style={styles.actionBar}>
                <button style={styles.backBtn} onClick={onBack}>← Back</button>
                <div style={styles.actionGroup}>
                    <button style={styles.editBtn} onClick={onEdit}>✏️ Edit</button>
                    <button style={styles.delBtn} onClick={() => onDelete(recipe.id)}>🗑️ Delete</button>
                </div>
            </div>

            <img src={recipe.imageLink || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800"}
                 alt={recipe.title} style={styles.img}/>

            <div style={styles.content}>
                <h1 style={styles.title}>{recipe.title}</h1>
                <p style={styles.author}>By {recipe.authorName || `Author ID: ${recipe.authorId}`}</p>

                <div style={styles.grid}>
                    <div>
                        <h3 style={styles.sectionTitle}>Ingredients</h3>
                        <ul style={styles.list}>
                            {Object.entries(recipe.ingredients || {}).map(([name, amt]) => (
                                <li key={name} style={styles.listItem}>
                                    <strong>{name}</strong>
                                    <span>{amt.amount} {amt.unit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 style={{...styles.sectionTitle, color: '#065f46'}}>🥗 Nutrition Facts</h3>
                        {nutrition.length === 0 ? <p style={{fontSize: '12px', color: '#94a3b8'}}>None provided.</p> : (
                            <table style={styles.table}>
                                <tbody>
                                {nutrition.map((item, i) => (
                                    <tr key={i}>
                                        <td style={styles.tableCell}>{item.name}</td>
                                        <td style={{
                                            ...styles.tableCell,
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

                <div style={styles.prepBox}>
                    <h3 style={styles.sectionTitle}>Preparation Instructions</h3>
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