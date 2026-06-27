import React, { type CSSProperties } from "react";

const dashContainer = {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    maxWidth: '100vw',
    fontFamily: 'sans-serif',
    backgroundColor: '#f8fafc',
    margin: 0,
    padding: 0,
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'hidden'
} as CSSProperties;

const dashMainWrapper = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden'
} as CSSProperties;

const dashTopBar = {
    height: '64px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 32px'
} as CSSProperties;

const dashLogoutBtn = {
    padding: '8px 16px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s'
} as CSSProperties;

const dashContentArea = {
    flex: 1,
    overflowY: 'auto',
    padding: '32px'
} as CSSProperties;

const dashHeaderTitle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 4px 0'
} as CSSProperties;

const dashSubTitle = {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    marginBottom: '24px'
} as CSSProperties;

const dashConsumeBtn = {
    padding: '8px 12px',
    backgroundColor: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px'
} as CSSProperties;

const dashLoadingText = {
    color: '#64748b',
    textAlign: 'center',
    marginTop: '40px'
} as CSSProperties;


const authContainer = {
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'sans-serif',
    padding: '20px'
} as CSSProperties;

const authCard = {
    boxSizing: 'border-box',
    padding: '30px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
} as CSSProperties;

const authForm = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
} as CSSProperties;

const authInputGroup = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
} as CSSProperties;

const authLabel = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333'
} as CSSProperties;

const authInput = {
    boxSizing: 'border-box',
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px'
} as CSSProperties;

const authButton = {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
} as CSSProperties;

const authError = {
    color: 'red',
    backgroundColor: '#ffe6e6',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '15px'
} as CSSProperties;

const authToggleText = {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px'
} as CSSProperties;

const authToggleLink = {
    color: '#007bff',
    cursor: 'pointer',
    fontWeight: 'bold'
} as CSSProperties;



export const dashBoardStyles = {
    container: dashContainer,
    mainWrapper: dashMainWrapper,
    topBar: dashTopBar,
    logoutBtn: dashLogoutBtn,
    contentArea: dashContentArea,
    headerTitle: dashHeaderTitle,
    subTitle: dashSubTitle,
    consumeBtn: dashConsumeBtn,
    loadingText: dashLoadingText
};

export const authPageStyles: Record<string, React.CSSProperties> = {
    container: authContainer,
    card: authCard,
    form: authForm,
    inputGroup: authInputGroup,
    label: authLabel,
    input: authInput,
    button: authButton,
    error: authError,
    toggleText: authToggleText,
    toggleLink: authToggleLink
};