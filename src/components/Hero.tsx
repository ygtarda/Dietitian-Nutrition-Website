// src/components/Hero.tsx

import React from 'react';
import './Hero.css';
// Yönlendirme için gerekli hook'u ekliyoruz
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
    const navigate = useNavigate(); // Yönlendirme fonksiyonunu tanımla

    return (
        <section className="hero-section">
            <div className="hero-content">
                <h1>Sağlıklı ve Mutlu Bir Yaşam İçin İlk Adımı Atın</h1>
                <p>Kişiye özel beslenme programları ve uzman desteğiyle hedeflerinize ulaşın.</p>

                {/* Tıklandığında /iletisim sayfasına git */}
                <button className="main-cta-button" onClick={() => navigate('/iletisim')}>
                    Ücretsiz Ön Görüşme Yapın
                </button>
            </div>

            <div className="hero-image-wrapper">
                <img
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop"
                    alt="Sağlıklı Beslenme"
                    className="hero-img"
                />
            </div>
        </section>
    );
};

export default Hero;