// src/components/Services.tsx
import React from 'react';
import './Services.css';

const Services: React.FC = () => {
    const services = [
        { title: "Online Diyet", icon: "💻", desc: "Dünyanın neresinde olursanız olun, size özel programlarla takibiniz bizde." },
        { title: "Kilo Yönetimi", icon: "⚖️", desc: "İdeal kilonuza ulaşmak ve korumak için sürdürülebilir beslenme alışkanlıkları." },
        { title: "Hastalıklarda Beslenme", icon: "🩺", desc: "Diyabet, tansiyon gibi durumlarda hastalığınıza özel tıbbi beslenme tedavisi." },
    ];

    return (
        <section className="services-section">
            <div className="main-services-grid"> {/* Sınıf ismi güncellendi */}
                {services.map((s, index) => (
                    <div key={index} className="service-item">
                        <div className="service-icon">{s.icon}</div>
                        <h3>{s.title}</h3>
                        <p>{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Services;