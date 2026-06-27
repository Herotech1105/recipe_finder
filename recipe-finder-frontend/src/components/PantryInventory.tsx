import React, { useState } from 'react';
import { type StorageIngredient } from '../dtos/types';
import { pantryInventoryStyles } from "../styles/componentStyles";

interface PantryInventoryProps {
    storageIngredients: StorageIngredient[];
    onSaveIngredient: (name: string, amount: number, unit: string) => Promise<void>;
    onDeleteIngredient: (name: string) => Promise<void>;
}

export default function PantryInventory({
                                            storageIngredients,
                                            onSaveIngredient,
                                            onDeleteIngredient,
                                        }: PantryInventoryProps): React.JSX.Element {
    const [newIngName, setNewIngName] = useState('');
    const [newIngAmount, setNewIngAmount] = useState<number>(0);
    const [newIngUnit, setNewIngUnit] = useState('g');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newIngName.trim()) return;
        await onSaveIngredient(newIngName.toLowerCase().trim(), newIngAmount, newIngUnit);
        setNewIngName('');
        setNewIngAmount(0);
    };

    return (
        <div>
            <h2 style={pantryInventoryStyles.headerTitle}>Pantry Inventory</h2>
            <p style={pantryInventoryStyles.subTitle}>Manage ingredients currently in your physical storage</p>

            <form onSubmit={handleSubmit} style={pantryInventoryStyles.form}>
                <div style={pantryInventoryStyles.inputGroup}>
                    <label style={pantryInventoryStyles.label}>Ingredient Name</label>
                    <input type="text" placeholder="e.g. flour" value={newIngName} onChange={e => setNewIngName(e.target.value)} style={pantryInventoryStyles.input} required />
                </div>
                <div style={pantryInventoryStyles.inputGroup}>
                    <label style={pantryInventoryStyles.label}>Amount</label>
                    <input type="number" step="any" placeholder="500" value={newIngAmount} onChange={e => setNewIngAmount(parseFloat(e.target.value) || 0)} style={pantryInventoryStyles.input} required />
                </div>
                <div style={pantryInventoryStyles.inputGroup}>
                    <label style={pantryInventoryStyles.label}>Unit</label>
                    <input type="text" placeholder="g, ml, Stck" value={newIngUnit} onChange={e => setNewIngUnit(e.target.value)} style={pantryInventoryStyles.input} required />
                </div>
                <button type="submit" style={pantryInventoryStyles.actionBtn}>Add / Update</button>
            </form>

            <table style={pantryInventoryStyles.table}>
                <thead>
                <tr>
                    <th style={pantryInventoryStyles.th}>Ingredient</th>
                    <th style={pantryInventoryStyles.th}>Available Stock</th>
                    <th style={pantryInventoryStyles.th}>Unit</th>
                    <th style={pantryInventoryStyles.th}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {storageIngredients.length === 0 ? (
                    <tr>
                        <td colSpan={4} style={{ ...pantryInventoryStyles.td, textAlign: 'center', color: '#94a3b8' }}>Your storage is empty. Add ingredients above.</td>
                    </tr>
                ) : (
                    storageIngredients.map((ing) => (
                        <tr key={ing.ingredientName}>
                            <td style={{ ...pantryInventoryStyles.td, fontWeight: 'bold' }}>{ing.ingredientName}</td>
                            <td style={pantryInventoryStyles.td}>{ing.amount}</td>
                            <td style={pantryInventoryStyles.td}>{ing.unit}</td>
                            <td style={pantryInventoryStyles.td}>
                                <button
                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}
                                    onClick={() => onDeleteIngredient(ing.ingredientName)}
                                >
                                    🗑️ Remove
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}
