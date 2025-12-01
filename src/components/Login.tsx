// src/components/Login.tsx

import React, { useState } from 'react';
import './Login.css';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface LoginProps {
    onLoginSuccess: () => void;
    onNavigate: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLoginSuccess();
        } catch (err: any) {
            console.error("Giriş hatası:", err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('E-posta veya şifre hatalı.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Çok fazla deneme yaptınız, lütfen bekleyin.');
            } else {
                setError('Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="login-section">
            <div className="login-card">
                <div className="login-header">
                    <div className="lock-icon">🔒</div>
                    <h2>Yönetici Paneli</h2>
                    <p>Devam etmek için lütfen giriş yapın.</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="login-error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">E-posta</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="ornek@diyetisyen.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Şifre</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="login-submit-button" disabled={isLoading}>
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            "Giriş Yap"
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <button onClick={onNavigate} className="back-link">
                        ← Ana Sayfaya Dön
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Login;