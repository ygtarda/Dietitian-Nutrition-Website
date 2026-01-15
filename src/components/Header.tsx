// src/components/Header.tsx

import React, { useState } from 'react';
import './Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
    diyetisyenAdi: string;
    onLogout: () => void;
    isAdminLinkVisible: boolean;
    isAdminPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ diyetisyenAdi, onLogout, isAdminPage = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobil menü durumu

    const isActive = (path: string) => location.pathname === path ? 'active-link' : '';

    // Linke tıklanınca menüyü kapat
    const closeMenu = () => setIsMenuOpen(false);

    // NOT: Scroll kilitleme (useEffect) kaldırıldı. 
    // Artık menü açıkken de sayfa kaydırılabilir, böylece kullanıcı sıkışmaz.

    return (
        <header className={`header ${isAdminPage ? 'admin-mode' : ''}`}>
            <div className="header-container">
                {/* LOGO ALANI */}
                <div className="logo">
                    <Link to="/" onClick={closeMenu} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h1>
                            {diyetisyenAdi}
                            <span className="admin-badge">{isAdminPage ? '| Panel' : ''}</span>
                        </h1>
                    </Link>
                    {!isAdminPage && <span className="slogan">Sağlıklı Yaşam Ortağınız</span>}
                </div>

                {/* MOBİL İÇİN HAMBURGER BUTONU */}
                <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span className={`nav-icon ${isMenuOpen ? 'open' : ''}`}></span>
                </div>

                {/* NAVİGASYON MENÜSÜ */}
                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    {!isAdminPage ? (
                        <>
                            <Link to="/" className={isActive('/')} onClick={closeMenu}>Ana Sayfa</Link>
                            <Link to="/hakkimda" className={isActive('/hakkimda')} onClick={closeMenu}>Hakkımda</Link>
                            <Link to="/hizmetler" className={isActive('/hizmetler')} onClick={closeMenu}>Hizmetler</Link>
                            <Link to="/icerik" className={isActive('/icerik')} onClick={closeMenu}>Blog & Tarif</Link>
                            <Link to="/iletisim" className={isActive('/iletisim')} onClick={closeMenu}>İletişim</Link>

                            <button className="randevu-button" onClick={() => { navigate('/randevu'); closeMenu(); }}>
                                Randevu Al
                            </button>
                        </>
                    ) : (
                        /* Admin Modu Menüsü */
                        <div className="admin-nav">
                            <span className="welcome-text">Hoşgeldiniz</span>
                            <button onClick={() => { onLogout(); closeMenu(); }} className="logout-button">
                                Çıkış Yap
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;