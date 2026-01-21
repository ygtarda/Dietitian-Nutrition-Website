// src/components/Header.tsx

import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import './Announcement.css';
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

    // Header elementini ölçmek için referans
    const headerRef = useRef<HTMLElement>(null);

    // State'ler
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showCampaign, setShowCampaign] = useState(true);

    const isActive = (path: string) => location.pathname === path ? 'active-link' : '';
    const closeMenu = () => setIsMenuOpen(false);

    // --- 1. DİNAMİK BOŞLUK AYARI ---
    useEffect(() => {
        const updatePagePadding = () => {
            if (headerRef.current) {
                const headerHeight = headerRef.current.offsetHeight;
                document.body.style.paddingTop = `${headerHeight}px`;
            }
        };

        updatePagePadding();
        window.addEventListener('resize', updatePagePadding);

        const observer = new ResizeObserver(() => {
            updatePagePadding();
        });

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => {
            window.removeEventListener('resize', updatePagePadding);
            observer.disconnect();
            document.body.style.paddingTop = '0px';
        };
    }, [showCampaign]);

    // --- 2. MOBİL MENÜ SCROLL KİLİDİ ---
    useEffect(() => {
        if (isMenuOpen) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        }
        return () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    // --- 3. AKILLI NAVBAR ---
    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                const currentScrollY = window.scrollY;

                if (isMenuOpen) {
                    setIsVisible(true);
                    return;
                }

                if (currentScrollY < 10) {
                    setIsVisible(true);
                } else {
                    if (currentScrollY > lastScrollY) {
                        setIsVisible(false);
                    } else {
                        setIsVisible(true);
                    }
                }
                setLastScrollY(currentScrollY);
            }
        };

        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY, isMenuOpen]);

    return (
        <header
            ref={headerRef}
            className={`header-wrapper ${!isVisible ? 'header-hidden' : ''} ${isAdminPage ? 'admin-mode' : ''}`}
        >
            {/* Kampanya Alanı */}
            {showCampaign && !isAdminPage && (
                <div className="announcement-bar">
                    <div className="announcement-content">
                        🎁 Yeni Online Diyet Paketi Avantajlı Fiyatlarla Başladı!
                    </div>
                    <button className="close-announcement" onClick={() => setShowCampaign(false)}>
                        ✕
                    </button>
                </div>
            )}

            {/* Navbar Alanı */}
            <div className="navbar-content">
                <div className="header-container">
                    <div className="logo">
                        <Link to="/" onClick={closeMenu} className="logo-link">
                            <div className="logo-text-group">
                                <h1>
                                    {diyetisyenAdi}
                                    <span className="admin-badge">{isAdminPage ? '| Panel' : ''}</span>
                                </h1>
                                {!isAdminPage && <span className="slogan">Sağlıklı Yaşam Ortağınız</span>}
                            </div>
                        </Link>
                    </div>

                    <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span className={`nav-icon ${isMenuOpen ? 'open' : ''}`}></span>
                    </div>

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
                            <div className="admin-nav">
                                <span className="welcome-text">Hoşgeldiniz</span>
                                {/* ÇIKIŞ BUTONU: Doğrudan onLogout çağrılır, msgbox yoktur */}
                                <button onClick={() => { onLogout(); closeMenu(); }} className="logout-button">
                                    Çıkış Yap
                                </button>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;