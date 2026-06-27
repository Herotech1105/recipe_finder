import React, {useState} from 'react';
import {authPageStyles} from "../styles/pagesStyles.ts";

interface Props {
    setAuthTrigger: React.Dispatch<React.SetStateAction<number>>;
}

const AuthPage = (props: Props) => {
    const {setAuthTrigger} = props;
    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const BASE_URL = '/api/auth';
        const endpoint = isLogin ? `${BASE_URL}/login` : `${BASE_URL}/register`;

        const payload = isLogin
            ? {username: formData.username, password: formData.password}
            : {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                fullName: formData.fullName
            };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            if (data.jwtToken) {
                localStorage.setItem('token', data.jwtToken);
                setAuthTrigger(prev => prev + 1);
            } else {
                setAuthTrigger(prev => prev + 1);
            }

        } catch (err) {
            setAuthTrigger(prev => prev + 1);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={authPageStyles.container}>
            <div style={authPageStyles.card}>
                <h2 style={{textAlign: 'center', margin: '0 0 20px 0'}}>
                    {isLogin ? 'Login' : 'Create an Account'}
                </h2>

                {error && <div style={authPageStyles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={authPageStyles.form}>
                    {!isLogin && (
                        <>
                            <div style={authPageStyles.inputGroup}>
                                <label style={authPageStyles.label}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={authPageStyles.input}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div style={authPageStyles.inputGroup}>
                        <label style={authPageStyles.label}>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            style={authPageStyles.input}
                            required
                        />
                    </div>

                    <div style={authPageStyles.inputGroup}>
                        <label style={authPageStyles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={authPageStyles.input}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} style={authPageStyles.button}>
                        {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <p style={authPageStyles.toggleText}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span style={authPageStyles.toggleLink} onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                    }}>
                        {isLogin ? 'Register here' : 'Login here'}
                    </span>
                </p>
            </div>
        </div>
    );
};


export default AuthPage;