// src/components/Appointment.tsx

import React, { useState, useEffect } from 'react';
import './Appointment.css';
import { db } from '../firebase';
import { collection, addDoc, Timestamp, query, where, onSnapshot } from 'firebase/firestore';

const services = [
    { id: 1, title: 'Online Diyet', price: '1500 TL', duration: '30 dk', icon: '💻', desc: 'Görüntülü görüşme ile haftalık takip.' },
    { id: 2, title: 'Yüz Yüze Görüşme', price: '2000 TL', duration: '45 dk', icon: '🏥', desc: 'Klinikte detaylı vücut analizi ve görüşme.' },
    { id: 3, title: 'Tek Seferlik Danışmanlık', price: '750 TL', duration: '45 dk', icon: '⚡', desc: 'Mevcut durum analizi ve yol haritası.' },
];

const timeSlots = [
    "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

const daysOfWeek = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

const Appointment: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState<any>(null);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null);
    const [selectedDateString, setSelectedDateString] = useState('');

    const [selectedTime, setSelectedTime] = useState('');
    const [formData, setFormData] = useState({ name: '', phone: '', note: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);

    // Başarılı durumu
    const [isSuccess, setIsSuccess] = useState(false);

    // --- TAKVİM MANTIĞI ---
    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => {
        const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return day === 0 ? 6 : day - 1;
    };
    const changeMonth = (offset: number) => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + offset)));

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (newDate < today) return;

        setSelectedDateObj(newDate);
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        setSelectedDateString(`${year}-${month}-${d}`);
        setSelectedTime('');
    };

    // --- DOLU SAATLERİ ÇEKME ---
    useEffect(() => {
        if (selectedDateString) {
            const q = query(collection(db, "booked_slots"), where("date", "==", selectedDateString));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setBookedSlots(snapshot.docs.map(doc => doc.data().time));
            });
            return () => unsubscribe();
        }
    }, [selectedDateString]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'phone' && !/^\d*$/.test(value)) return;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    // YENİ: Formu sıfırlama fonksiyonu
    const resetForm = () => {
        setStep(1);
        setSelectedService(null);
        setSelectedDateObj(null);
        setSelectedDateString('');
        setSelectedTime('');
        setFormData({ name: '', phone: '', note: '' });
        setIsSuccess(false); // Başarı mesajını da kapat
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.phone) {
            alert("Lütfen telefon numaranızı giriniz.");
            setIsSubmitting(false);
            return;
        }

        try {
            await addDoc(collection(db, "appointments"), {
                service: selectedService.title,
                price: selectedService.price,
                date: selectedDateString,
                time: selectedTime,
                clientName: formData.name,
                clientPhone: formData.phone,
                clientNote: formData.note,
                createdAt: Timestamp.now(),
                status: 'pending'
            });

            // 1. Yeşil kutucuğu göster
            setIsSuccess(true);

            // 2. 3 Saniye sonra (3000ms) otomatik olarak başa dön
            setTimeout(() => {
                resetForm();
            }, 3000);

        } catch (error) {
            console.error(error);
            alert("Hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const blanks = Array(firstDay).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return (
            <div className="calendar-grid">
                {daysOfWeek.map(d => <div key={d} className="calendar-day-name">{d}</div>)}
                {blanks.map((_, i) => <div key={`blank-${i}`} className="calendar-day empty"></div>)}
                {days.map(day => {
                    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const isPast = dateToCheck < today;
                    const isSelected = selectedDateObj?.getDate() === day && selectedDateObj?.getMonth() === currentDate.getMonth();
                    return (
                        <div key={day} className={`calendar-day ${isPast ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`} onClick={() => !isPast && handleDateClick(day)}>
                            {day}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <section className="appointment-section">
            <div className="appointment-container">
                <div className="appointment-header">
                    <h2>Randevu Talebi Oluştur</h2>
                    <p>Size en uygun zamanı seçin, değişime başlayın.</p>
                </div>

                <div className="progress-track">
                    <div className={`track-step ${step >= 1 ? 'active' : ''}`}>1</div>
                    <div className="track-line"></div>
                    <div className={`track-step ${step >= 2 ? 'active' : ''}`}>2</div>
                    <div className="track-line"></div>
                    <div className={`track-step ${step >= 3 ? 'active' : ''}`}>3</div>
                </div>

                <div className="step-content">
                    {/* ADIM 1 */}
                    {step === 1 && (
                        <div className="step-wrapper fade-in">
                            <h3>Bir Hizmet Seçin</h3>
                            <div className="services-grid-new">
                                {services.map(srv => (
                                    <div key={srv.id} className={`service-card-new ${selectedService?.id === srv.id ? 'selected' : ''}`} onClick={() => setSelectedService(srv)}>
                                        <div className="srv-icon">{srv.icon}</div>
                                        <div className="srv-info"><h4>{srv.title}</h4><p>{srv.desc}</p></div>
                                        <div className="srv-price">{srv.price}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="action-row">
                                <button className="primary-btn" disabled={!selectedService} onClick={() => setStep(2)}>İleri Devam Et</button>
                            </div>
                        </div>
                    )}

                    {/* ADIM 2 */}
                    {step === 2 && (
                        <div className="step-wrapper fade-in">
                            <h3>Tarih ve Saat Seçin</h3>
                            <div className="calendar-container">
                                <div className="calendar-header">
                                    <button onClick={() => changeMonth(-1)}>&lt;</button>
                                    <span>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                                    <button onClick={() => changeMonth(1)}>&gt;</button>
                                </div>
                                {renderCalendar()}
                            </div>
                            {selectedDateString && (
                                <div className="time-slots-container">
                                    <h4>Müsait Saatler ({selectedDateString})</h4>
                                    <div className="slots-grid-new">
                                        {timeSlots.map(time => {
                                            const isBooked = bookedSlots.includes(time);
                                            return <button key={time} disabled={isBooked} className={`slot-btn ${selectedTime === time ? 'active' : ''} ${isBooked ? 'booked' : ''}`} onClick={() => setSelectedTime(time)}>{time}</button>
                                        })}
                                    </div>
                                </div>
                            )}
                            <div className="action-row">
                                <button className="secondary-btn" onClick={() => setStep(1)}>Geri</button>
                                <button className="primary-btn" disabled={!selectedDateString || !selectedTime} onClick={() => setStep(3)}>İleri</button>
                            </div>
                        </div>
                    )}

                    {/* ADIM 3 */}
                    {step === 3 && (
                        <div className="step-wrapper fade-in">
                            <h3>Bilgilerinizi Girin</h3>
                            <div className="confirmation-box">
                                <div className="conf-item"><strong>Hizmet:</strong> {selectedService.title}</div>
                                <div className="conf-item"><strong>Tarih:</strong> {selectedDateString} Saat: {selectedTime}</div>
                                <div className="conf-item price"><strong>Tutar:</strong> {selectedService.price}</div>
                            </div>

                            <form onSubmit={handleSubmit} className="app-form">
                                <div className="input-group">
                                    <label>Ad Soyad</label>
                                    <input type="text" name="name" value={formData.name} required onChange={handleChange} disabled={isSuccess} placeholder="Adınız Soyadınız" />
                                </div>
                                <div className="input-group">
                                    <label>Telefon Numarası</label>
                                    <input type="tel" name="phone" value={formData.phone} required onChange={handleChange} disabled={isSuccess} placeholder="05XX XXX XX XX" />
                                </div>
                                <div className="input-group">
                                    <label>Notunuz (Opsiyonel)</label>
                                    <textarea name="note" value={formData.note} rows={3} onChange={handleChange} disabled={isSuccess} placeholder="Belirtmek istediğiniz özel bir durum..."></textarea>
                                </div>

                                {/* Başarılı ise Butonlar Gider, Yeşil Kutu Gelir */}
                                {isSuccess ? (
                                    <div className="success-badge fade-in">
                                        ✅ Randevu talebiniz başarıyla alındı! Form yenileniyor...
                                    </div>
                                ) : (
                                    <>
                                        <div className="info-badge">
                                            ℹ️ Randevu talebiniz oluşturulduktan sonra onay için sizinle iletişime geçilecektir.
                                        </div>
                                        <div className="action-row">
                                            <button type="button" className="secondary-btn" onClick={() => setStep(2)}>Geri</button>
                                            <button type="submit" className="primary-btn" disabled={isSubmitting}>
                                                {isSubmitting ? 'Oluşturuluyor...' : 'Randevuyu Onayla'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Appointment;