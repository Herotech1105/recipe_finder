import React, { useState } from 'react';

interface Props {
    // Update the prop type definition
    setAuthTrigger: React.Dispatch<React.SetStateAction<number>>;
}

const AuthPage = (props: Props) => {
    const { setAuthTrigger } = props;
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
            ? { username: formData.username, password: formData.password }
            : { username: formData.username, password: formData.password, email: formData.email, fullName: formData.fullName };

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
                localStorage.setItem('token', data.token);

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
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ textAlign: 'center', margin: '0 0 20px 0' }}>
                    {isLogin ? 'Login' : 'Create an Account'}
                </h2>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    {!isLogin && (
                        <>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <p style={styles.toggleText}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span style={styles.toggleLink} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                        {isLogin ? 'Register here' : 'Login here'}
                    </span>
                </p>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: { boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'sans-serif', padding: '20px' },
    card: { boxSizing: 'border-box', padding: '30px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '14px', fontWeight: 'bold', color: '#333' },
    input: { boxSizing: 'border-box', width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' },
    button: { padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
    error: { color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px', fontSize: '14px', textAlign: 'center', marginBottom: '15px' },
    toggleText: { marginTop: '20px', textAlign: 'center', fontSize: '14px' },
    toggleLink: { color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }
};

export default AuthPage;