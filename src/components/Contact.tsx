// src/components/Contact.tsx

import React, { useState, useRef } from 'react';
import './Contact.css';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
// import emailjs from '@emailjs/browser'; // Şimdilik kapalı

const Contact: React.FC = () => {
    const form = useRef<HTMLFormElement>(null);

    // // --- EMAILJS BİLGİLERİ (İleride burayı doldurursun) ---
    // const SERVICE_ID = "YOUR_SERVICE_ID";
    // const TEMPLATE_ID = "YOUR_TEMPLATE_ID";
    // const PUBLIC_KEY = "YOUR_PUBLIC_KEY";

    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        user_phone: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Telefon numarası kontrolü: Sadece rakamlara izin ver
        if (name === 'user_phone') {
            if (/^\d*$/.test(value)) {
                setFormData({ ...formData, [name]: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('idle');

        try {
            // 1. Firebase'e Kaydet (Telefon bilgisiyle birlikte)
            await addDoc(collection(db, "messages"), {
                name: formData.user_name,
                email: formData.user_email,
                phone: formData.user_phone,
                message: formData.message,
                createdAt: Timestamp.now(),
                read: false
            });

            // 2. Mail Gönder (Şu an kapalı, açmak için import'u ve burayı açmalısın)
            /*
            if (form.current && SERVICE_ID !== "YOUR_SERVICE_ID") {
                await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY);
            }
            */

            setStatus('success');
            setFormData({ user_name: '', user_email: '', user_phone: '', message: '' });

        } catch (error) {
            console.error("Hata:", error);
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="iletisim" className="contact-section">
            <div className="contact-container"> {/* CSS'teki sınıf ismiyle eşleşti */}

                {/* SOL TARAF: İletişim Bilgileri */}
                <div className="contact-info-box"> {/* CSS'teki sınıf ismiyle eşleşti */}
                    <div className="info-content"> {/* CSS'te stil tanımı yok ama yapısal bütünlük için kalabilir */}
                        <h3>Bize Ulaşın</h3>
                        <p className="contact-desc"> {/* CSS'teki sınıf ismiyle eşleşti */}
                            Sağlıklı yaşam yolculuğunuzda size rehberlik etmek için buradayız.
                            Sorularınız için formu doldurabilir veya doğrudan iletişime geçebilirsiniz.
                        </p>

                        <div className="info-items"> {/* CSS'teki sınıf ismiyle eşleşti */}
                            <div className="info-item"> {/* CSS'teki sınıf ismiyle eşleşti */}
                                <span className="icon">📍</span>
                                <div className="details"> {/* CSS'te .details stili yok ama yapı için kalabilir */}
                                    <strong>Adres</strong> {/* CSS'te strong etiketi kullanılmış */}
                                    <p>Örnek Mah. Sağlık Sok. No: 12/A İstanbul</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="icon">✉️</span>
                                <div className="details">
                                    <strong>E-posta</strong>
                                    <p>info@diyetisyengulodek.com</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="icon">📞</span>
                                <div className="details">
                                    <strong>Telefon</strong>
                                    <p>0555 123 45 67</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mini Harita */}
                    <div className="map-wrapper"> {/* CSS'teki sınıf ismiyle eşleşti */}
                        <iframe
                            title="Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192697.8885057635!2d28.871754944062635!3d41.00549580932269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2zIsSwc3RhbmJ1bCI!5e0!3m2!1str!2str!4v1705438200000!5m2!1str!2str"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>

                {/* SAĞ TARAF: Form */}
                <div className="contact-form-box"> {/* CSS'teki sınıf ismiyle eşleşti */}
                    <form ref={form} onSubmit={handleSubmit}>
                        <h3>Mesaj Gönder</h3>

                        <div className="input-group"> {/* CSS'teki sınıf ismiyle eşleşti */}
                            <label>Adınız Soyadınız</label>
                            <input
                                type="text"
                                name="user_name"
                                value={formData.user_name}
                                onChange={handleChange}
                                required
                                placeholder="Örn: Arda Yiğit"
                            />
                        </div>

                        <div className="input-group">
                            <label>E-posta Adresiniz</label>
                            <input
                                type="email"
                                name="user_email"
                                value={formData.user_email}
                                onChange={handleChange}
                                required
                                placeholder="mail@gmail.com"
                            />
                        </div>

                        {/* Telefon Alanı */}
                        <div className="input-group">
                            <label>Telefon Numaranız</label>
                            <input
                                type="tel"
                                name="user_phone"
                                value={formData.user_phone}
                                onChange={handleChange}
                                required
                                placeholder="05XX XXX XX XX"
                            />
                        </div>

                        <div className="input-group">
                            <label>Mesajınız</label>
                            <textarea
                                name="message"
                                rows={4}
                                value={formData.message}
                                onChange={handleChange}
                                required
                                placeholder="Size nasıl yardımcı olabiliriz?"
                            ></textarea>
                        </div>

                        <button type="submit" className="send-msg-btn" disabled={isSubmitting}> {/* CSS'teki sınıf ismiyle eşleşti */}
                            {isSubmitting ? "Gönderiliyor..." : "GÖNDER"}
                        </button>

                        {status === 'success' && <div className="success-msg">Mesajınız başarıyla iletildi. Teşekkürler!</div>} {/* CSS'teki sınıf ismiyle eşleşti */}
                        {status === 'error' && <div className="error-msg">Bir hata oluştu. Lütfen tekrar deneyin.</div>} {/* CSS'teki sınıf ismiyle eşleşti */}
                    </form>
                </div>

            </div>
        </section>
    );
};

export default Contact;