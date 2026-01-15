// src/components/About.tsx

import React from 'react';
import './About.css';

interface AboutProps {
    egitimBilgisi: string;
}

const About: React.FC<AboutProps> = ({ egitimBilgisi }) => {
    return (
        <section id="hakkimda" className="about-section">
            <div className="about-container">

                {/* --- GÖRSEL ALANI --- */}
                <div className="about-image-wrapper">
                    <img
                        src="/profil.jpg"
                        alt="Uzman Diyetisyen Gül Ödek"
                        className="about-img"
                        loading="lazy"
                    />
                    <div className="image-frame"></div>
                </div>

                {/* --- METİN ALANI --- */}
                <div className="about-content">
                    <span className="subtitle">TANIŞALIM</span>
                    <h2>Uzman Diyetisyen Gül Ödek</h2>
                    <p className="education-highlight">{egitimBilgisi}</p>

                    <p className="bio-text">
                        Merhaba! Ben Gül Ödek. Beslenme bilimini yaşam tarzına dönüştürmeyi hedefleyen,
                        sürdürülebilir ve kişiye özel çözümler sunan bir beslenme uzmanıyım.
                        Yasaklarla dolu diyet listeleri yerine, hayatınıza entegre edebileceğiniz,
                        sizi mutlu eden ve sağlığınızı koruyan programlar hazırlıyorum.
                    </p>

                    <p className="bio-text">
                        Amacım sadece kilo verdirmek değil; bedeninizi tanımanızı sağlamak,
                        yemekle ilişkinizi iyileştirmek ve hayat boyu sürecek sağlıklı alışkanlıklar kazandırmaktır.
                    </p>

                    {/* --- İSTATİSTİKLER --- */}
                    <div className="stats-row">
                        <div className="stat-item">
                            <span className="stat-number">5+</span>
                            <span className="stat-label">Yıl Deneyim</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">1000+</span>
                            <span className="stat-label">Mutlu Danışan</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">50+</span>
                            <span className="stat-label">Kurumsal Eğitim</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default About;
