// src/components/FAQ.tsx

import React, { useState } from 'react';
import './FAQ.css';

interface FaqItem {
    id: number;
    question: string;
    answer: string;
}

const faqData: FaqItem[] = [
    {
        id: 1,
        question: 'Diyet programları kişiye özel midir?',
        answer: 'Evet, tüm beslenme programları yaşınıza, sağlık durumunuza, yaşam tarzınıza, fiziksel aktivite düzeyinize ve hedeflerinize özel olarak hazırlanır. Hazır listeler asla kullanılmaz.',
    },
    {
        id: 2,
        question: 'Online diyet nasıl işliyor?',
        answer: 'Online diyet, ilk görüşmenin ardından size özel hazırlanan programın e-posta veya uygulama üzerinden iletilmesiyle başlar. Haftalık online görüşmelerle ilerleme takip edilir ve program güncellenir.',
    },
    {
        id: 3,
        question: 'Diyetisyen takibi ne kadar sürer?',
        answer: 'Bu süre, hedeflerinize ve vücudunuzun programa verdiği yanıta göre değişir. Ortalama olarak 8 ila 12 hafta arasında sağlıklı sonuçlar gözlemlenmeye başlar.',
    },
];

const FAQ: React.FC = () => {
    // Hangi sorunun açık olduğunu tutan state
    const [openId, setOpenId] = useState<number | null>(null);

    // Akordeon (accordion) işlevi
    const toggleFaq = (id: number) => {
        // Eğer aynı soruya tıklanırsa kapat, değilse aç
        setOpenId(openId === id ? null : id);
    };

    return (
        <section id="sss" className="faq-section">
            <h2>Sıkça Sorulan Sorular</h2>

            <div className="faq-container">
                {faqData.map((item) => (
                    <div key={item.id} className={`faq-item ${openId === item.id ? 'open' : ''}`}>
                        {/* Soru Başlığı */}
                        <button
                            className="faq-question-button"
                            onClick={() => toggleFaq(item.id)}
                            aria-expanded={openId === item.id}
                        >
                            {item.question}
                            <span className="toggle-icon">{openId === item.id ? '−' : '+'}</span>
                        </button>

                        {/* Cevap İçeriği (Sadece açıksa görünür) */}
                        {openId === item.id && (
                            <div className="faq-answer-content">
                                <p>{item.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ;