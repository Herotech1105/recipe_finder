import type { CSSProperties } from "react";

const sidebarBase = {
    width: '240px',
    minWidth: '240px',
    backgroundColor: '#0f172a',
    color: '#fff',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column'
} as CSSProperties;

const sidebarBrand = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '32px',
    color: '#10b981'
} as CSSProperties;

const sidebarNav = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flexGrow: 1
} as CSSProperties;

const sidebarNavBtn = (isActive: boolean): CSSProperties => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    background: isActive ? '#059669' : 'transparent',
    color: isActive ? '#fff' : '#94a3b8',
    textAlign: 'left',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '14px'
});

const recipeGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px'
} as CSSProperties;

const recipeCard = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
} as CSSProperties;

const recipeImg = {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    backgroundColor: '#f1f5f9'
} as CSSProperties;

const recipeBody = {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
} as CSSProperties;

const recipeTitle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 16px 0'
} as CSSProperties;

const recipeBtn = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '8px',
    color: '#334155',
    fontWeight: '500',
    cursor: 'pointer'
} as CSSProperties;


const recipeFormBase = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
} as CSSProperties;

const recipeFormGroup = { marginBottom: '16px' } as CSSProperties;

const recipeFormLabel = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: '6px',
    textTransform: 'uppercase'
} as CSSProperties;

const recipeFormInput = {
    width: '100%',
    padding: '10px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    boxSizing: 'border-box'
} as CSSProperties;

const recipeFormRow = {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
    alignItems: 'center'
} as CSSProperties;

const recipeFormAddBtn = {
    background: 'none',
    border: 'none',
    color: '#059669',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '13px'
} as CSSProperties;

const recipeFormFooter = {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
} as CSSProperties;

const recipeFormSubmit = {
    padding: '10px 16px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
} as CSSProperties;

const recipeFormCancel = {
    padding: '10px 16px',
    backgroundColor: '#fff',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    cursor: 'pointer'
} as CSSProperties;

// Recipe Detail Elements
const recipeDetailWrapper = {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
} as CSSProperties;

const recipeDetailActionBar = {
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
} as CSSProperties;

const recipeDetailBackBtn = {
    background: 'none',
    border: 'none',
    color: '#475569',
    cursor: 'pointer',
    fontWeight: '500'
} as CSSProperties;

const recipeDetailActionGroup = { display: 'flex', gap: '8px' } as CSSProperties;

const recipeDetailEditBtn = {
    padding: '6px 12px',
    backgroundColor: '#fef3c7',
    color: '#d97706',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
} as CSSProperties;

const recipeDetailDelBtn = {
    padding: '6px 12px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
} as CSSProperties;

const recipeDetailImg = { width: '100%', height: '260px', objectFit: 'cover' } as CSSProperties;

const recipeDetailContent = { padding: '32px' } as CSSProperties;

const recipeDetailTitle = {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 4px 0',
    color: '#0f172a'
} as CSSProperties;

const recipeDetailAuthor = { fontSize: '14px', color: '#64748b', margin: '0 0 24px 0' } as CSSProperties;

const recipeDetailGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' } as CSSProperties;

const recipeDetailSectionTitle = {
    fontSize: '18px',
    fontWeight: '600',
    borderBottom: '2px solid #f1f5f9',
    paddingBottom: '8px',
    margin: '0 0 12px 0'
} as CSSProperties;

const recipeDetailList = { listStyle: 'none', padding: 0, margin: 0 } as CSSProperties;

const recipeDetailListItem = {
    padding: '10px 0',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px'
} as CSSProperties;

const recipeDetailTable = { width: '100%', borderCollapse: 'collapse', fontSize: '14px' } as CSSProperties;

const recipeDetailTableCell = { padding: '8px 0', borderBottom: '1px solid #f1f5f9' } as CSSProperties;

const recipeDetailPrepBox = {
    marginTop: '32px',
    borderTop: '2px solid #f1f5f9',
    paddingTop: '24px'
} as CSSProperties;

// Pantry Inventory Elements
const pantryHeaderTitle = { fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px 0' } as CSSProperties;
const pantrySubTitle = { fontSize: '14px', color: '#64748b', margin: 0, marginBottom: '24px' } as CSSProperties;
const pantryFormBase = { display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'flex-end', backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' } as CSSProperties;
const pantryInputGroup = { display: 'flex', flexDirection: 'column', gap: '4px' } as CSSProperties;
const pantryLabel = { fontSize: '12px', fontWeight: 'bold', color: '#475569' } as CSSProperties;
const pantryInput = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' } as CSSProperties;
const pantryActionBtn = { padding: '8px 12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' } as CSSProperties;
const pantryTable = { width: '100%', borderCollapse: 'collapse', marginTop: '16px', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } as CSSProperties;
const pantryTh = { backgroundColor: '#f1f5f9', padding: '12px 16px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', color: '#475569', textAlign: 'left' } as CSSProperties;
const pantryTd = { padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#334155' } as CSSProperties;



export const sidebarStyles = {
    sidebar: sidebarBase,
    brand: sidebarBrand,
    nav: sidebarNav,
    navBtn: sidebarNavBtn,
};

export const recipeListStyles = {
    grid: recipeGrid,
    card: recipeCard,
    img: recipeImg,
    body: recipeBody,
    title: recipeTitle,
    btn: recipeBtn
};

export const recipeFormStyles = {
    form: recipeFormBase,
    group: recipeFormGroup,
    label: recipeFormLabel,
    input: recipeFormInput,
    row: recipeFormRow,
    addBtn: recipeFormAddBtn,
    footer: recipeFormFooter,
    submit: recipeFormSubmit,
    cancel: recipeFormCancel
};

export const recipeDetailStyles = {
    wrapper: recipeDetailWrapper,
    actionBar: recipeDetailActionBar,
    backBtn: recipeDetailBackBtn,
    actionGroup: recipeDetailActionGroup,
    editBtn: recipeDetailEditBtn,
    delBtn: recipeDetailDelBtn,
    img: recipeDetailImg,
    content: recipeDetailContent,
    title: recipeDetailTitle,
    author: recipeDetailAuthor,
    grid: recipeDetailGrid,
    sectionTitle: recipeDetailSectionTitle,
    list: recipeDetailList,
    listItem: recipeDetailListItem,
    table: recipeDetailTable,
    tableCell: recipeDetailTableCell,
    prepBox: recipeDetailPrepBox
};

export const pantryInventoryStyles = {
    headerTitle: pantryHeaderTitle,
    subTitle: pantrySubTitle,
    form: pantryFormBase,
    inputGroup: pantryInputGroup,
    label: pantryLabel,
    input: pantryInput,
    actionBtn: pantryActionBtn,
    table: pantryTable,
    th: pantryTh,
    td: pantryTd,
};