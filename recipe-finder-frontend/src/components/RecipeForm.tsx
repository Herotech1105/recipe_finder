import React, { useState, useEffect, type CSSProperties, type FormEvent } from 'react';
import { recipeService } from '../service/RecipeService.ts';
import type { Unit, RecipeRequestDTO, Ingredients } from '../dtos/types.ts';

interface RecipeFormProps {
    token: string;
    recipeId?: number | null;
    onSave: () => void;
    onCancel: () => void;
}

// Fixed: Defined the missing internal state structure for the form rows
interface IngredientRow {
    name: string;
    unit: Unit;
    amount: number;
}

export default function RecipeForm({ recipeId, onSave, onCancel }: RecipeFormProps): React.JSX.Element {
    const [title, setTitle] = useState<string>('');
    const [preparation, setPreparation] = useState<string>('');
    const [ingredientRows, setIngredientRows] = useState<IngredientRow[]>([{ name: '', unit: 'g', amount: 0 }]);

    useEffect(() => {
        if (recipeId) {
            recipeService.getRecipeById(recipeId).then(data => {
                setTitle(data.title);
                setPreparation(data.preparation);
                if (data.ingredients) {
                    setIngredientRows(Object.entries(data.ingredients).map(([name, amt]) => ({
                        name,
                        unit: amt.unit,
                        amount: amt.amount
                    })));
                }
            });
        }
    }, [recipeId]);

    const handleIngredientChange = (index: number, field: keyof IngredientRow, val: string | number): void => {
        const updated = [...ingredientRows];
        if (field === 'amount') {
            updated[index][field] = Number(val);
        } else if (field === 'unit') {
            updated[index][field] = val as Unit;
        } else {
            updated[index][field] = val as string;
        }
        setIngredientRows(updated);
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        // Fixed: Initialized the object structure to match the exact Ingredients type structure
        const ingredientsMap: Ingredients = {};

        ingredientRows.forEach(row => {
            if (row.name) {
                // Fixed: The key must be just the ingredient name string, not JSON stringified
                ingredientsMap[row.name] = {
                    unit: row.unit,
                    amount: row.amount
                };
            }
        });

        const payload: RecipeRequestDTO = { title, preparation, ingredients: ingredientsMap };
        try {
            if (recipeId) {
                await recipeService.updateRecipe(recipeId, payload);
            } else {
                await recipeService.createRecipe(payload);
            }
            onSave();
        } catch (err) {
            console.error(err);
        }
    };

    const styles = {
        form: {
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#fff',
            padding: '32px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
        } as CSSProperties,
        group: { marginBottom: '16px' } as CSSProperties,
        label: {
            display: 'block',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#475569',
            marginBottom: '6px',
            textTransform: 'uppercase'
        } as CSSProperties,
        input: {
            width: '100%',
            padding: '10px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            boxSizing: 'border-box'
        } as CSSProperties,
        row: { display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' } as CSSProperties,
        addBtn: {
            background: 'none',
            border: 'none',
            color: '#059669',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '13px'
        } as CSSProperties,
        footer: { marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' } as CSSProperties,
        submit: {
            padding: '10px 16px',
            backgroundColor: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
        } as CSSProperties,
        cancel: {
            padding: '10px 16px',
            backgroundColor: '#fff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            cursor: 'pointer'
        } as CSSProperties
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={{ margin: '0 0 24px 0', color: '#0f172a' }}>
                {recipeId ? 'Edit Recipe Configuration' : 'Add New Recipe'}
            </h2>

            <div style={styles.group}>
                <label style={styles.label}>Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required minLength={6}
                       maxLength={100} style={styles.input}/>
            </div>

            <div style={styles.group}>
                <label style={styles.label}>Instructions</label>
                <textarea rows={4} value={preparation} onChange={e => setPreparation(e.target.value)} maxLength={10000}
                          style={styles.input}/>
            </div>

            <div style={styles.group}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={styles.label}>Ingredients</label>
                    <button type="button" style={styles.addBtn} onClick={() => setIngredientRows([...ingredientRows, {
                        name: '',
                        unit: 'g',
                        amount: 0
                    }])}>＋ Add
                    </button>
                </div>

                {ingredientRows.map((row, i) => (
                    <div key={i} style={styles.row}>
                        <input type="text" placeholder="Name" value={row.name}
                               onChange={e => handleIngredientChange(i, 'name', e.target.value)}
                               style={{ ...styles.input, flex: 2 }} required/>
                        <input type="number" placeholder="Amt" value={row.amount}
                               onChange={e => handleIngredientChange(i, 'amount', e.target.value)} step="any" min="0.01"
                               style={{ ...styles.input, flex: 1 }} required/>
                        <select value={row.unit} onChange={e => handleIngredientChange(i, 'unit', e.target.value)}
                                style={{ ...styles.input, flex: 1, backgroundColor: '#fff' }}>
                            {/* Fixed typo alignment */}
                            {(['g', 'ml', 'Stck'] as Unit[]).map(u => (
                                <option key={u} value={u}>{u}</option>
                            ))}
                        </select>
                        <button type="button"
                                onClick={() => setIngredientRows(ingredientRows.filter((_, idx) => idx !== i))}
                                style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>❌
                        </button>
                    </div>
                ))}
            </div>

            <div style={styles.footer}>
                <button type="button" style={styles.cancel} onClick={onCancel}>Cancel</button>
                <button type="submit" style={styles.submit}>Save Recipe</button>
            </div>
        </form>
    );
}