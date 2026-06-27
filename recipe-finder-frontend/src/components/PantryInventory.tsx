import React, { useState, type CSSProperties } from 'react';
import { type StorageIngredient } from '../dtos/types';

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
            <h2 style={styles.headerTitle}>Pantry Inventory</h2>
            <p style={styles.subTitle}>Manage ingredients currently in your physical storage</p>

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Ingredient Name</label>
                    <input type="text" placeholder="e.g. flour" value={newIngName} onChange={e => setNewIngName(e.target.value)} style={styles.input} required />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Amount</label>
                    <input type="number" step="any" placeholder="500" value={newIngAmount} onChange={e => setNewIngAmount(parseFloat(e.target.value) || 0)} style={styles.input} required />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Unit</label>
                    <input type="text" placeholder="g, ml, Stck" value={newIngUnit} onChange={e => setNewIngUnit(e.target.value)} style={styles.input} required />
                </div>
                <button type="submit" style={styles.actionBtn}>Add / Update</button>
            </form>

            <table style={styles.table}>
                <thead>
                <tr>
                    <th style={styles.th}>Ingredient</th>
                    <th style={styles.th}>Available Stock</th>
                    <th style={styles.th}>Unit</th>
                    <th style={styles.th}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {storageIngredients.length === 0 ? (
                    <tr>
                        <td colSpan={4} style={{ ...styles.td, textAlign: 'center', color: '#94a3b8' }}>Your storage is empty. Add ingredients above.</td>
                    </tr>
                ) : (
                    storageIngredients.map((ing) => (
                        <tr key={ing.ingredientName}>
                            <td style={{ ...styles.td, fontWeight: 'bold' }}>{ing.ingredientName}</td>
                            <td style={styles.td}>{ing.amount}</td>
                            <td style={styles.td}>{ing.unit}</td>
                            <td style={styles.td}>
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

const styles = {
    headerTitle: { fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px 0' } as CSSProperties,
    subTitle: { fontSize: '14px', color: '#64748b', margin: 0, marginBottom: '24px' } as CSSProperties,
    form: { display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'flex-end', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' } as CSSProperties,
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '4px' } as CSSProperties,
    label: { fontSize: '12px', fontWeight: 'bold', color: '#475569' } as CSSProperties,
    input: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' } as CSSProperties,
    actionBtn: { padding: '8px 12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' } as CSSProperties,
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '16px', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } as CSSProperties,
    th: { backgroundColor: '#f1f5f9', padding: '12px 16px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', color: '#475569', textAlign: 'left' } as CSSProperties,
    td: { padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#334155' } as CSSProperties,
};