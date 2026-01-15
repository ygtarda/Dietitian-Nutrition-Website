// src/components/FAQ.tsx

import React, { useState } from 'react';
import './FAQ.css';

const faqData = [
    {
        question: "Online diyet süreci nasıl işliyor?",
        answer: "İlk görüşmemizde detaylı bir anamnez alarak yaşam tarzınızı, beslenme alışkanlıklarınızı ve sağlık durumunuzu analiz ediyoruz. Ardından size özel hazırlanan beslenme programını WhatsApp üzerinden iletiyor ve haftalık takiplerle süreci yönetiyoruz."
    },
    {
        question: "Listeler kişiye özel mi hazırlanıyor?",
        answer: "Kesinlikle! Her bireyin metabolizması, kan değerleri, sevdiği/sevmediği besinler ve yaşam koşulları farklıdır. Bu yüzden hazır listeler yerine tamamen size ve hedeflerinize uygun, sürdürülebilir programlar hazırlıyoruz."
    },
    {
        question: "Kaçamak yaparsam ne olur?",
        answer: "Diyet bir yasaklar bütünü değil, dengeleme sanatıdır. Kaçamak yaptığınızda suçluluk hissetmek yerine, bir sonraki öğünde veya günde nasıl dengeleyebileceğimizi konuşarak sürece kaldığımız yerden devam ediyoruz."
    },
    {
        question: "Sadece kilo vermek için mi başvurabilirim?",
        answer: "Hayır. Kilo alma, kilo koruma, hastalıklarda beslenme (diyabet, tansiyon vb.), sporcu beslenmesi, gebelik ve emzirme dönemi beslenmesi gibi birçok alanda profesyonel danışmanlık hizmeti sunuyoruz."
    },
    {
        question: "Ödemeyi nasıl yapabilirim?",
        answer: "Randevu oluşturduktan sonra size ileteceğimiz IBAN numarasına havale/EFT yoluyla ödemenizi güvenle gerçekleştirebilirsiniz."
    }
];

const FAQ: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="sss" className="faq-section">
            <div className="faq-container">
                <div className="faq-header">
                    <h2>Sıkça Sorulan Sorular</h2>
                    <p>Aklınıza takılan soruların cevaplarını burada bulabilirsiniz.</p>
                </div>

                <div className="faq-list">
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className="faq-question">
                                <h3>{item.question}</h3>
                                <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
                            </div>
                            <div className="faq-answer">
                                <div className="answer-content">
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;