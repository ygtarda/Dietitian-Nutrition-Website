// src/components/About.tsx

import React from 'react';
import './About.css';

// DİKKAT: Import satırını sildik!
// Resim artık 'public/profil.jpg' konumunda olmalı.

interface AboutProps {
    egitimBilgisi: string;
}

const About: React.FC<AboutProps> = ({ egitimBilgisi }) => {
    return (
        <section id="hakkimda" className="about-section">
            <div className="about-container">

                <div className="about-image-wrapper">
                    <img
                        /* VITE/REACT İÇİN EN GARANTİ YOL: */
                        /* Başındaki / işareti 'public' klasörünü temsil eder */
                        src="/profil.jpg"
                        alt="Uzman Diyetisyen Gül Ödek"
                        className="about-img"
                        onError={(e) => {
                            // Eğer resim hala yoksa, konsola hata basar ve stok fotoyu koyar
                            console.error("Resim yüklenemedi. Lütfen 'public/profil.jpg' dosyasını kontrol et.");
                            e.currentTarget.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop";
                        }}
                    />
                    <div className="image-frame"></div>
                </div>

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