import React from 'react';
import './About.css';

// FOTOĞRAFI BURADA İÇERİ AKTARIYORUZ
// Eğer fotoğrafın adı farklıysa veya uzantısı .jpeg ise burayı düzelt!
import profilFoto from '../assets/profil.png';

interface AboutProps {
    egitimBilgisi: string;
}

const About: React.FC<AboutProps> = ({ egitimBilgisi }) => {
    return (
        <section id="hakkinda" className="about-section">
            <div className="about-image-container">
                {/* Import ettiğimiz değişkeni süslü parantez içinde kullanıyoruz */}
                <img
                    src={profilFoto}
                    alt="Uzman Diyetisyen Elif Yılmaz"
                />
            </div>
            <div className="about-content">
                <h2>Beni Tanıyın</h2>
                <p>Merhaba, ben Uzman Diyetisyen Elif Yılmaz. Sağlıklı beslenmenin sadece bir diyet listesinden ibaret olmadığına, yaşam boyu sürdürülebilir bir alışkanlık olduğuna inanıyorum.</p>

                <h3>Eğitim ve Yaklaşım</h3>
                <p>
                    {egitimBilgisi} <br /><br />
                    Danışanlarımla birlikte, onların yaşam tarzlarına, sağlık durumlarına ve hedeflerine uygun, kişiselleştirilmiş beslenme planları oluşturuyorum. Yargılamadan, destekleyici bir yaklaşımla size rehberlik etmek için buradayım.
                </p>
                <ul>
                    <li>✅ Kişiselleştirilmiş Beslenme Danışmanlığı</li>
                    <li>✅ Yeme Bozukluklarında Destek</li>
                    <li>✅ Sporcu Beslenmesi</li>
                </ul>
            </div>
        </section>
    );
};

export default About;