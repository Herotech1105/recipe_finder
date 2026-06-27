import React, {useState, useEffect, type FormEvent} from 'react';
import {recipeService} from '../service/RecipeService.ts';
import type {Unit, RecipeRequestDTO, Ingredients} from '../dtos/types.ts';
import {recipeFormStyles} from "../styles/componentStyles.ts";

interface RecipeFormProps {
    token: string;
    recipeId?: number | null;
    onSave: () => void;
    onCancel: () => void;
}

interface IngredientRow {
    name: string;
    unit: Unit;
    amount: number | '';
}

export default function RecipeForm({recipeId, onSave, onCancel}: RecipeFormProps): React.JSX.Element {
    const [title, setTitle] = useState<string>('');
    const [preparation, setPreparation] = useState<string>('');
    const [ingredientRows, setIngredientRows] = useState<IngredientRow[]>([{name: '', unit: 'g', amount: ''}]);

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

    const handleIngredientChange = (index: number, field: keyof IngredientRow, val: string): void => {
        const updated = [...ingredientRows];
        if (field === 'amount') {
            updated[index][field] = val === '' ? '' : Number(val);
        } else if (field === 'unit') {
            updated[index][field] = val as Unit;
        } else {
            updated[index][field] = val;
        }
        setIngredientRows(updated);
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        const ingredientsMap: Ingredients = {};

        ingredientRows.forEach(row => {
            if (row.name) {
                ingredientsMap[row.name] = {
                    unit: row.unit,
                    amount: row.amount === '' ? 0 : row.amount
                };
            }
        });

        const payload: RecipeRequestDTO = {title, preparation, ingredients: ingredientsMap};
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

    return (
        <form onSubmit={handleSubmit} style={recipeFormStyles.form}>
            <h2 style={{margin: '0 0 24px 0', color: '#0f172a'}}>
                {recipeId ? 'Edit Recipe Configuration' : 'Add New Recipe'}
            </h2>

            <div style={recipeFormStyles.group}>
                <label style={recipeFormStyles.label}>Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required minLength={6}
                       maxLength={100} style={recipeFormStyles.input}/>
            </div>

            <div style={recipeFormStyles.group}>
                <label style={recipeFormStyles.label}>Instructions</label>
                <textarea rows={4} value={preparation} onChange={e => setPreparation(e.target.value)} maxLength={10000}
                          style={recipeFormStyles.input} required minLength={20} />
            </div>

            <div style={recipeFormStyles.group}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <label style={recipeFormStyles.label}>Ingredients</label>
                    <button type="button" style={recipeFormStyles.addBtn}
                            onClick={() => setIngredientRows([...ingredientRows, {
                                name: '',
                                unit: 'g',
                                amount: ''
                            }])}>＋ Add
                    </button>
                </div>

                {ingredientRows.map((row, i) => (
                    <div key={i} style={recipeFormStyles.row}>
                        <input type="text" placeholder="Name" value={row.name}
                               onChange={e => handleIngredientChange(i, 'name', e.target.value)}
                               style={{...recipeFormStyles.input, flex: 2}} required/>
                        <input type="number" placeholder="Amt" value={row.amount}
                               onChange={e => handleIngredientChange(i, 'amount', e.target.value)} step="any" min="0.01"
                               style={{...recipeFormStyles.input, flex: 1}} required/>
                        <select value={row.unit} onChange={e => handleIngredientChange(i, 'unit', e.target.value)}
                                style={{...recipeFormStyles.input, flex: 1, backgroundColor: '#fff'}}>
                            {(['g', 'ml', 'Stck'] as Unit[]).map(u => (
                                <option key={u} value={u}>{u}</option>
                            ))}
                        </select>
                        <button type="button"
                                onClick={() => setIngredientRows(ingredientRows.filter((_, idx) => idx !== i))}
                                style={{background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer'}}>❌
                        </button>
                    </div>
                ))}
            </div>

            <div style={recipeFormStyles.footer}>
                <button type="button" style={recipeFormStyles.cancel} onClick={onCancel}>Cancel</button>
                <button type="submit" style={recipeFormStyles.submit}>Save Recipe</button>
            </div>
        </form>
    );
}