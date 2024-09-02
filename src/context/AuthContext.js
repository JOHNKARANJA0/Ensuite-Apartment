import { createContext, useState, useContext, useEffect } from 'react';
import "../components/Spinner.css";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            fetch('http://127.0.0.1:5555/check_session', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data && data.id && data.token_verified) {
                    setUser(data);
                } else {
                    localStorage.removeItem('access_token');
                    setUser(null);
                }
            })
            .catch(error => {
                console.error('Error during session check:', error);
                localStorage.removeItem('access_token');
                setUser(null);
            })
            .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = (email, password) => {
        return fetch('http://127.0.0.1:5555/login', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.access_token) {
                localStorage.setItem('access_token', data.access_token);
                return fetch('http://127.0.0.1:5555/check_session', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${data.access_token}`
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(userData => {
                    if (userData.token_verified) {
                        setUser(userData);
                        return userData;
                    } else {
                        throw new Error('Token not verified');
                    }
                });
            } else {
                throw new Error('Invalid email or password');
            }
        });
    };

    const signup = (name, email, phone, password) => {
        return fetch('http://127.0.0.1:5555/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password })
        })
        .then(response => {
            console.log(response)
            if (!response.ok) {
                return response.json().then(err => {
                    console.error('Signup error details:', err);
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                });
            }
            return response.json();
        });
    };

    const verifyToken = (email, token) => {
        return fetch('http://127.0.0.1:5555/verify_token', {    
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, token })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        });
    };

    const logout = () => {
        setLoading(true)
        fetch('http://127.0.0.1:5555/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        }).then(response => {
            if (response.ok) {
                localStorage.removeItem('access_token');
                setUser(null);
                setLoading(false)
            } else {
                console.error('Failed to log out');
                setLoading(false)
            }
        }).catch(error => {
            setLoading(false)
            console.error('Error logging out:', error);
        });
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, verifyToken}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;