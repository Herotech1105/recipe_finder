import React, {type CSSProperties } from 'react';
import type {RecipeListItemDTO} from '../dtos/types';

interface RecipeListProps {
    recipes: RecipeListItemDTO[];
    onSelect: (id: number) => void;
}

export default function RecipeList({ recipes, onSelect }: RecipeListProps): React.JSX.Element {
    const styles = {
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' } as CSSProperties,
        card: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' } as CSSProperties,
        img: { width: '100%', height: '180px', objectFit: 'cover', backgroundColor: '#f1f5f9' } as CSSProperties,
        body: { padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } as CSSProperties,
        title: { fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px 0' } as CSSProperties,
        btn: { width: '100%', padding: '10px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#334155', fontWeight: '500', cursor: 'pointer' } as CSSProperties
    };

    if (recipes.length === 0) {
        return <div style={{ textAlign: 'center', color: '#64748b', padding: '48px', border: '2px dashed #cbd5e1', borderRadius: '12px' }}>No recipes listed.</div>;
    }

    return (
        <div style={styles.grid}>
            {recipes.map(recipe => (
                <div key={recipe.id} style={styles.card}>
                    <img src={recipe.imageLink || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400"} alt={recipe.title} style={styles.img} />
                    <div style={styles.body}>
                        <h3 style={styles.title}>{recipe.title}</h3>
                        <button style={styles.btn} onClick={() => onSelect(recipe.id)}>👁️ View Details</button>
                    </div>
                </div>
            ))}
        </div>
    );
}