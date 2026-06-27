import './App.css';
import AuthPage from "./pages/AuthPage.tsx";
import {useEffect, useState} from "react";
import Dashboard from "./pages/Dashboard.tsx";

function App() {
    const [authTrigger, setAuthTrigger] = useState(0);
    const [jwt, setJwt] = useState(localStorage.getItem('token') || "");

    useEffect(() => {
        const token = localStorage.getItem('token') || "";
        setJwt(token);
    }, [authTrigger]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthTrigger(prev => prev + 1);
    };

    return (
        <>
            {jwt ? (
                <Dashboard onLogout={handleLogout} />
            ) : (
                <AuthPage setAuthTrigger={setAuthTrigger}/>
            )}
        </>
    );
}

export default App;