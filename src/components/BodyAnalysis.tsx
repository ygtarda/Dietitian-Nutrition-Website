// src/components/BodyAnalysis.tsx

import React, { useState } from 'react';
import './BodyAnalysis.css';
import { useNavigate } from 'react-router-dom';

interface Question {
    id: number;
    text: string;
    options: string[];
}

const questions: Question[] = [
    {
        id: 1,
        text: "Yaş aralığınız nedir?",
        options: ["18-25", "26-40", "41-55", "55+"]
    },
    {
        id: 2,
        text: "Temel hedefiniz nedir?",
        options: ["Kilo Vermek", "Kilo Almak", "Kas Yapmak", "Sağlıklı Yaşamak/Detoks"]
    },
    {
        id: 3,
        text: "Ne sıklıkla egzersiz yapıyorsunuz?",
        options: ["Hiç yapmıyorum", "Haftada 1-2 gün", "Haftada 3-5 gün", "Her gün/Profesyonel"]
    }
];

const BodyAnalysis: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [recommendation, setRecommendation] = useState<{ title: string, desc: string } | null>(null);

    const handleOptionClick = (option: string) => {
        const newAnswers = [...answers, option];
        setAnswers(newAnswers);

        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = (finalAnswers: string[]) => {
        const goal = finalAnswers[1];
        const activity = finalAnswers[2];

        let resultTitle = "";
        let resultDesc = "";

        if (goal === "Kas Yapmak" || activity === "Her gün/Profesyonel") {
            resultTitle = "🚀 Sporcu Beslenmesi Paketi";
            resultDesc = "Performansınızı artırmak ve kas kütlenizi koruyarak hedefinize ulaşmak için protein ağırlıklı ve antrenman programınıza entegre özel beslenme planı.";
        } else if (goal === "Kilo Vermek") {
            resultTitle = "📉 Kilo Yönetimi & Zayıflama Paketi";
            resultDesc = "Aç kalmadan, metabolizma hızınıza uygun, sürdürülebilir kilo kaybı hedefleyen kişiye özel diyet programı.";
        } else if (goal === "Kilo Almak") {
            resultTitle = "📈 Sağlıklı Kilo Alma Paketi";
            resultDesc = "Hacim kazanmak ve sağlıklı bir şekilde ideal kilonuza ulaşmak için yüksek besin değerine sahip özel program.";
        } else {
            resultTitle = "✨ Online Takip & Sağlıklı Yaşam";
            resultDesc = "Mevcut kilonuzu korumak, bağışıklığınızı güçlendirmek ve daha enerjik hissetmek için dengeli beslenme programı.";
        }

        setRecommendation({ title: resultTitle, desc: resultDesc });
        setShowResult(true);
    };

    const resetQuiz = () => {
        setCurrentStep(0);
        setAnswers([]);
        setShowResult(false);
        setRecommendation(null);
    };

    // GÜNCELLENEN KISIM: Yönlendirme ve Yukarı Kaydırma
    const handleContactRedirect = () => {
        navigate('/iletisim');
        // Sayfa geçişi tamamlandıktan sonra ekranı en tepeye kaydır
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    };

    return (
        <section className="analysis-section">
            <div className="analysis-container">
                <div className="analysis-header">
                    <h2>🎯 Ücretsiz Vücut Analiz Sihirbazı</h2>
                    <p>Size en uygun beslenme paketini 3 adımda öğrenin.</p>
                </div>

                {!showResult ? (
                    <div className="question-card">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>

                        <h3>{questions[currentStep].text}</h3>

                        <div className="options-grid">
                            {questions[currentStep].options.map((option, index) => (
                                <button
                                    key={index}
                                    className="option-btn"
                                    onClick={() => handleOptionClick(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        <div className="step-indicator">
                            Adım {currentStep + 1} / {questions.length}
                        </div>
                    </div>
                ) : (
                    <div className="result-card">
                        <div className="result-icon">🎉</div>
                        <h3>Size Özel Önerimiz:</h3>
                        <h4 className="result-title">{recommendation?.title}</h4>
                        <p className="result-desc">{recommendation?.desc}</p>

                        <div className="result-actions">
                            <button className="contact-btn" onClick={handleContactRedirect}>
                                Paket Hakkında Bilgi Al
                            </button>
                            <button className="restart-btn" onClick={resetQuiz}>
                                Tekrar Analiz Et
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BodyAnalysis;