import './App.css';
import AuthPage from "./pages/AuthPage.tsx";
import { useEffect, useState } from "react";

function App() {
    const [authTrigger, setAuthTrigger] = useState(0);
    const [jwt, setJwt] = useState(localStorage.getItem('token') || "");

    useEffect(() => {
        const token = localStorage.getItem('token') || "";
        setJwt(token);
    }, [authTrigger]);

    return (
        <>
            {jwt ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h1>Welcome Back! 🎉</h1>
                    <p>You are successfully authenticated.</p>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            setAuthTrigger(prev => prev + 1);
                        }}
                        style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '10px' }}
                    >
                        Log Out
                    </button>
                </div>
            ) : (
                <AuthPage setAuthTrigger={setAuthTrigger} />
            )}
        </>
    );
}

export default App;