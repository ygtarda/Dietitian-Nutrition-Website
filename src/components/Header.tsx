// src/components/Header.tsx

import React from 'react';
import './Header.css';
// React Router Dom kütüphanesinden gerekli araçları alıyoruz
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
    diyetisyenAdi: string;
    onLogout: () => void; // Çıkış fonksiyonu
    isAdminLinkVisible: boolean;
    isAdminPage?: boolean;
}

const Header: React.FC<HeaderProps> = ({ diyetisyenAdi, onLogout, isAdminPage = false }) => {
    const navigate = useNavigate(); // Butonla yönlendirme için
    const location = useLocation(); // Şu an hangi sayfadayız?

    // Hangi sayfadaysak o linkin altını çizmek veya renkli yapmak için yardımcı fonksiyon
    const isActive = (path: string) => location.pathname === path ? 'active-link' : '';

    return (
        <header className={`header ${isAdminPage ? 'admin-mode' : ''}`}>
            <div className="logo">
                {/* Logo tıklandığında Ana Sayfaya yönlendir */}
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h1>
                        {diyetisyenAdi}
                        <span className="admin-badge">{isAdminPage ? '| Yönetim Paneli' : ''}</span>
                    </h1>
                </Link>
                {!isAdminPage && <span className="slogan">Sağlıklı Yaşam Ortağınız</span>}
            </div>

            <nav className="nav-menu">
                {/* Normal Kullanıcı Modu */}
                {!isAdminPage ? (
                    <>
                        {/* <a href="..."> yerine <Link to="..."> kullanıyoruz */}
                        <Link to="/" className={isActive('/')}>Ana Sayfa</Link>
                        <Link to="/hakkimda" className={isActive('/hakkimda')}>Hakkımda</Link>
                        <Link to="/hizmetler" className={isActive('/hizmetler')}>Hizmetler & Araçlar</Link>
                        <Link to="/icerik" className={isActive('/icerik')}>Blog & Tarifler</Link>
                        <Link to="/iletisim" className={isActive('/iletisim')}>İletişim</Link>

                        {/* Randevu butonu artık İletişim sayfasına götürüyor */}
                        <button className="randevu-button" onClick={() => navigate('/iletisim')}>
                            Randevu Al
                        </button>
                    </>
                ) : (
                    /* Admin Modu */
                    <div className="admin-nav">
                        <span className="welcome-text">Hoşgeldiniz</span>
                        <button onClick={onLogout} className="logout-button">
                            Çıkış Yap ➔
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;