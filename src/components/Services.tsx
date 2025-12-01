// src/components/Services.tsx

import React from 'react';
import './Services.css';

// TypeScript ile tek bir hizmetin yapısını (tipini) tanımlıyoruz
interface Service {
    id: number;
    title: string;
    description: string;
    icon: string; // İkon yerine geçecek kısa metin/emoji
}

// Sunduğumuz hizmetlerin verileri
const servicesData: Service[] = [
    {
        id: 1,
        title: 'Kilo Yönetimi',
        description: 'Sağlıklı ve kalıcı kilo verme veya alma hedeflerinize ulaşmanız için özel programlar.',
        icon: '⚖️',
    },
    {
        id: 2,
        title: 'Hastalıkta Beslenme',
        description: 'Diyabet, tansiyon, tiroid gibi kronik hastalıklara yönelik tıbbi beslenme tedavisi.',
        icon: '🔬',
    },
    {
        id: 3,
        title: 'Online Takip',
        description: 'Dünyanın neresinde olursanız olun, görüntülü görüşmelerle kişiye özel danışmanlık.',
        icon: '💻',
    },
];

const Services: React.FC = () => {
    return (
        <section id="hizmetler" className="services-section">
            <h2>Uzmanlık Alanlarım ve Hizmetlerim</h2>
            <p className="services-intro">İhtiyaçlarınıza özel olarak tasarlanmış beslenme danışmanlığı paketleri.</p>

            <div className="services-grid">
                {/* servicesData dizisini dolaşarak her biri için ServiceCard oluşturuyoruz */}
                {servicesData.map((service) => (
                    <div key={service.id} className="service-card">
                        <span className="service-icon">{service.icon}</span>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Services;