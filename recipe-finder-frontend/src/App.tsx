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

    return (
        <>
            {jwt ? (
                <>
                    <Dashboard></Dashboard>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            setAuthTrigger(prev => prev + 1);
                        }}
                        style={{padding: '10px 20px', cursor: 'pointer', marginTop: '10px'}}
                    >
                        Log Out
                    </button>
                </>
            ) : (
                <AuthPage setAuthTrigger={setAuthTrigger}/>
            )}
        </>
    );
}

export default App;