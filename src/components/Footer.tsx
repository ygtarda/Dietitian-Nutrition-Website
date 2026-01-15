// src/components/Footer.tsx

import React from 'react';
import './Footer.css';
import { Link, useNavigate } from 'react-router-dom';

interface FooterProps {
    diyetisyenAdi: string;
    telifHakkiYili: number;
}

const Footer: React.FC<FooterProps> = ({ diyetisyenAdi, telifHakkiYili }) => {
    const navigate = useNavigate();

    return (
        <footer className="footer-section">
            <div className="footer-container">

                {/* Logo ve Slogan */}
                <div className="footer-brand">
                    <h3 className="footer-title">{diyetisyenAdi}</h3>
                    <p className="footer-desc">
                        Bilimsel ve sürdürülebilir beslenme yöntemleriyle hayatınıza sağlık katın.
                        Kişiye özel diyet programları ve online takiple hedeflerinize ulaşın.
                    </p>
                    <div className="social-icons">
                        {/* Sosyal medya linkleri buraya gelebilir */}
                        <a href="#" onClick={(e) => e.preventDefault()}>Instagram</a>
                        <a href="#" onClick={(e) => e.preventDefault()}>LinkedIn</a>
                        <a href="#" onClick={(e) => e.preventDefault()}>Twitter</a>
                    </div>
                </div>

                {/* Hızlı Linkler */}
                <div className="footer-links">
                    <h4>Hızlı Erişim</h4>
                    <ul>
                        <li><Link to="/">Ana Sayfa</Link></li>
                        <li><Link to="/hakkimda">Hakkımda</Link></li>
                        <li><Link to="/hizmetler">Hizmetler & Araçlar</Link></li>
                        <li><Link to="/icerik">Blog & Tarifler</Link></li>
                        <li><Link to="/iletisim">İletişim</Link></li>
                        <li><Link to="/randevu">Randevu Al</Link></li>
                    </ul>
                </div>

                {/* İletişim Bilgileri */}
                <div className="footer-contact">
                    <h4>İletişim</h4>
                    <div className="contact-item">
                        <span>📍</span>
                        <p>Örnek Mah. Sağlık Sok. No: 12/A İstanbul</p>
                    </div>
                    <div className="contact-item">
                        <span>💌</span>
                        <p>info@diyetisyengulodek.com</p>
                    </div>
                    <div className="contact-item">
                        <span>📞</span>
                        <p>0555 123 45 67</p>
                    </div>
                </div>
            </div>

            {/* Alt Bar */}
            <div className="footer-bottom">
                <div className="copyright">
                    &copy; {telifHakkiYili} <span className="highlight">{diyetisyenAdi}</span>. Tüm Hakları Saklıdır.
                </div>
                <button onClick={() => navigate('/login')} className="admin-footer-link">
                    Yönetici Girişi 🔒
                </button>
            </div>
        </footer>
    );
};

export default Footer;