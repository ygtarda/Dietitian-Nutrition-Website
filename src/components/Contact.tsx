// src/components/Contact.tsx

import React, { useState } from 'react';
import './Contact.css';
// Firebase importları
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface FormData {
    adSoyad: string;
    email: string;
    mesaj: string;
}

const Contact: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        adSoyad: '',
        email: '',
        mesaj: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Veritabanına 'messages' adında bir koleksiyon açıp içine kaydediyoruz
            await addDoc(collection(db, "messages"), {
                name: formData.adSoyad,
                email: formData.email,
                message: formData.mesaj,
                createdAt: Timestamp.now(), // Mesajın atıldığı tarih
                read: false // Henüz okunmadı olarak işaretle
            });

            alert(`Teşekkürler ${formData.adSoyad}! Mesajınız başarıyla iletildi. En kısa sürede dönüş yapacağım.`);

            // Formu temizle
            setFormData({ adSoyad: '', email: '', mesaj: '' });

        } catch (error) {
            console.error("Mesaj gönderilirken hata:", error);
            alert("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="iletisim" className="contact-section">
            <div className="contact-info">
                <h2>İletişime Geçin</h2>
                <p>Sağlıklı bir yaşama adım atmak için bugün bana ulaşın. Sorularınızı yanıtlamaktan memnuniyet duyarım.</p>

                <p>
                    <strong>E-posta:</strong> info@diyetisyenelifyilmaz.com<br />
                    <strong>Telefon:</strong> 0555 123 45 67
                </p>

                <div className="social-links">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📸 Instagram</a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦 Twitter</a>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
                <h3>Randevu veya Bilgi Talebi</h3>

                <div className="form-group">
                    <label htmlFor="adSoyad">Adınız Soyadınız:</label>
                    <input
                        type="text"
                        id="adSoyad"
                        name="adSoyad"
                        value={formData.adSoyad}
                        onChange={handleChange}
                        required
                        placeholder="Örn: Ayşe Yılmaz"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">E-posta Adresiniz:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="ornek@email.com"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="mesaj">Mesajınız:</label>
                    <textarea
                        id="mesaj"
                        name="mesaj"
                        rows={5}
                        value={formData.mesaj}
                        onChange={handleChange}
                        required
                        placeholder="Merhaba, online diyet hakkında bilgi almak istiyorum..."
                    ></textarea>
                </div>

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                </button>
            </form>
        </section>
    );
};

export default Contact;