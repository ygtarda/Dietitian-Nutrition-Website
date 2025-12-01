// src/components/Footer.tsx

import React from 'react';
import './Footer.css';
// Link bileşeni ve yönlendirme kancasını (hook) ekliyoruz
import { Link, useNavigate } from 'react-router-dom';

interface FooterProps {
    diyetisyenAdi: string;
    telifHakkiYili: number;
    // onAdminClick prop'una artık gerek yok, içeriden yönlendiriyoruz
}

const Footer: React.FC<FooterProps> = ({ diyetisyenAdi, telifHakkiYili }) => {
    const navigate = useNavigate(); // Yönlendirme fonksiyonu

    return (
        <footer className="footer-section">
            <div className="footer-content">
                <div className="footer-logo">
                    <h3>{diyetisyenAdi}</h3>
                    <p>Sağlıklı Yaşam ve Beslenme Danışmanlığı</p>
                </div>

                <div className="footer-links">
                    <h4>Hızlı Menü</h4>
                    <ul>
                        {/* Standart <a> etiketleri yerine <Link> kullanıyoruz */}
                        <li><Link to="/hakkimda">Hakkımda</Link></li>
                        <li><Link to="/hizmetler">Hizmetler</Link></li>
                        <li><Link to="/icerik">Blog</Link></li>
                        <li><Link to="/iletisim">İletişim</Link></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h4>İletişim</h4>
                    <p>Adres: Örnek Mah. Sağlık Sok. No: 12/A İstanbul</p>
                    <p>E-posta: info@diyetisyenim.com</p>
                    <p>Telefon: 0555 123 45 67</p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {telifHakkiYili} {diyetisyenAdi}. Tüm Hakları Saklıdır.</p>
                <p>
                    {/* Butona tıklayınca /login sayfasına git */}
                    <button onClick={() => navigate('/login')} className="admin-footer-link">
                        Yönetim Paneli Girişi
                    </button>
                </p>
            </div>
        </footer>
    );
};

export default Footer;