// src/components/Calculator.tsx

import React, { useState } from 'react';
import './Calculator.css';

// TypeScript ile kalori form verilerinin tipini tanımlıyoruz
interface CalorieFormData {
    cinsiyet: 'erkek' | 'kadin' | '';
    kilo: number | '';
    boy: number | '';
    yas: number | '';
    aktivite: number | ''; // Katsayı olarak saklanacak
}

const Calculator: React.FC = () => {
    // Kalori Hesaplayıcı State'leri
    const [calorieFormData, setCalorieFormData] = useState<CalorieFormData>({
        cinsiyet: '',
        kilo: '',
        boy: '',
        yas: '',
        aktivite: '',
    });
    const [kaloriSonuc, setKaloriSonuc] = useState<number | null>(null);

    // VKİ Hesaplayıcı State'leri
    const [vkiKilo, setVkiKilo] = useState<number | ''>('');
    const [vkiBoy, setVkiBoy] = useState<number | ''>('');
    const [vkiSonuc, setVkiSonuc] = useState<string | null>(null);

    // --- Kalori Hesaplama Fonksiyonları ---

    const handleCalorieChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        // Eğer değer sayı olmalıysa, string yerine sayıya çeviriyoruz (veya boş bırakıyoruz)
        const processedValue = (name === 'kilo' || name === 'boy' || name === 'yas')
            ? (value === '' ? '' : Number(value))
            : value;

        setCalorieFormData(prev => ({
            ...prev,
            [name]: processedValue,
        }));
    };

    const calculateCalories = (e: React.FormEvent) => {
        e.preventDefault();
        const { cinsiyet, kilo, boy, yas, aktivite } = calorieFormData;

        // Tüm alanların dolu olup olmadığını kontrol et
        if (!cinsiyet || !kilo || !boy || !yas || !aktivite) {
            alert('Lütfen tüm Kalori Hesaplama alanlarını doldurun.');
            return;
        }

        let BMR: number; // Bazal Metabolizma Hızı (BMR)

        // Harris-Benedict Formülü (Basit Versiyon)
        if (cinsiyet === 'erkek') {
            BMR = 88.362 + (13.397 * kilo) + (4.799 * boy) - (5.677 * yas);
        } else { // kadin
            BMR = 447.593 + (9.247 * kilo) + (3.098 * boy) - (4.330 * yas);
        }

        // Toplam Günlük Enerji Harcaması (TDEE)
        const TDEE = BMR * aktivite;

        setKaloriSonuc(Math.round(TDEE));

    };

    // --- VKİ Hesaplama Fonksiyonları ---

    const handleVkiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Boş ise boş, dolu ise sayı olarak sakla
        const processedValue = value === '' ? '' : Number(value);

        if (name === 'vkiKilo') {
            setVkiKilo(processedValue);
        } else {
            setVkiBoy(processedValue);
        }
        setVkiSonuc(null); // Yeni giriş yapıldığında sonucu temizle
    };

    const calculateBMI = (e: React.FormEvent) => {
        e.preventDefault();

        if (!vkiKilo || !vkiBoy || vkiKilo <= 0 || vkiBoy <= 0) {
            alert('Lütfen geçerli Kilo ve Boy değerlerini girin.');
            return;
        }

        // Boyu cm'den metreye çevir (175 cm -> 1.75 m)
        const boyMetre = vkiBoy / 100;

        // VKİ Formülü: Kilo (kg) / Boy (m)^2
        const vkiValue = vkiKilo / (boyMetre * boyMetre);
        const vkiRounded = vkiValue.toFixed(2);

        let kategori = '';

        if (vkiValue < 18.5) {
            kategori = 'Zayıf';
        } else if (vkiValue >= 18.5 && vkiValue < 24.9) {
            kategori = 'Normal Kilolu';
        } else if (vkiValue >= 25 && vkiValue < 29.9) {
            kategori = 'Fazla Kilolu';
        } else {
            kategori = 'Obez';
        }

        setVkiSonuc(`VKİ değeriniz: ${vkiRounded} (${kategori})`);
    };

    // --- Genel JSX/HTML Yapısı ---

    return (
        <section id="hesaplamalar" className="calculator-section">
            <h2>Sağlık Hesaplama Araçları</h2>
            <p>Kendi verilerinizi girerek günlük enerji ihtiyacınızı ve Vücut Kitle İndeksinizi (VKİ) hızlıca öğrenin.</p>

            <div className="calculators-container">

                {/* --- 1. Günlük Kalori İhtiyacı Hesaplayıcı --- */}
                <div className="calculator-card calorie-calc">
                    <h3>Günlük Kalori İhtiyacı</h3>
                    <form onSubmit={calculateCalories}>

                        <div className="form-group">
                            <label htmlFor="cinsiyet">Cinsiyet:</label>
                            <select name="cinsiyet" id="cinsiyet" value={calorieFormData.cinsiyet} onChange={handleCalorieChange} required>
                                <option value="">Seçiniz</option>
                                <option value="kadin">Kadın</option>
                                <option value="erkek">Erkek</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="kilo">Kilo (kg):</label>
                            <input type="number" name="kilo" id="kilo" value={calorieFormData.kilo} onChange={handleCalorieChange} required min="30" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="boy">Boy (cm):</label>
                            <input type="number" name="boy" id="boy" value={calorieFormData.boy} onChange={handleCalorieChange} required min="100" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="yas">Yaş:</label>
                            <input type="number" name="yas" id="yas" value={calorieFormData.yas} onChange={handleCalorieChange} required min="15" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="aktivite">Aktivite Seviyesi:</label>
                            <select name="aktivite" id="aktivite" value={calorieFormData.aktivite} onChange={handleCalorieChange} required>
                                <option value="">Seçiniz</option>
                                <option value="1.2">Çok Az Hareketli (Masa başı iş)</option>
                                <option value="1.375">Az Hareketli (Haftada 1-3 gün spor)</option>
                                <option value="1.55">Orta Hareketli (Haftada 3-5 gün spor)</option>
                                <option value="1.725">Çok Hareketli (Haftada 6-7 gün spor)</option>
                                <option value="1.9">Aşırı Hareketli (Günde çift antrenman)</option>
                            </select>
                        </div>

                        <button type="submit" className="calc-button">Kalori Hesapla</button>

                        {kaloriSonuc && (
                            <div className="result-box success">
                                Tahmini Günlük Kalori İhtiyacınız: <strong>{kaloriSonuc} kcal</strong>
                            </div>
                        )}

                    </form>
                </div>

                {/* --- 2. Vücut Kitle İndeksi (VKİ) Hesaplayıcı --- */}
                <div className="calculator-card vki-calc">
                    <h3>Vücut Kitle İndeksi (VKİ)</h3>
                    <form onSubmit={calculateBMI}>
                        <div className="form-group">
                            <label htmlFor="vkiKilo">Kilo (kg):</label>
                            <input type="number" name="vkiKilo" id="vkiKilo" value={vkiKilo} onChange={handleVkiChange} required min="30" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="vkiBoy">Boy (cm):</label>
                            <input type="number" name="vkiBoy" id="vkiBoy" value={vkiBoy} onChange={handleVkiChange} required min="100" />
                        </div>

                        <button type="submit" className="calc-button">VKİ Hesapla</button>

                        {vkiSonuc && (
                            <div className="result-box info">
                                <strong>{vkiSonuc}</strong>
                            </div>
                        )}

                    </form>

                    <p className="vki-info-text">
                        <strong>VKİ</strong>, vücudunuzdaki yağ oranını gösteren bir değer değildir, yalnızca bir referans noktasıdır. Detaylı analiz için uzmana danışın.
                    </p>
                </div>

            </div>
        </section>
    );
};

export default Calculator;