import React, { useState, useEffect } from 'react';
import './GiftSurprise.css';

interface GiftSurpriseProps {
    isActive: boolean;
    onComplete: () => void;
}

// --- DUYGUSAL MESAJ İÇERİĞİ ---
const NOTE_TITLE = "Mutlu Yıllar Aşkım";

const NOTE_BODY =
    "Doğum günün kutlu olsun güzelim. Hayallerini gerçekleştireceğin yolda sana eşlik etmek için bu siteyi hazırladım.\n\n" +
    "İş hayatında kullandıkça, arkanda seni çok seven birinin olduğunu hatırlaman için. İyi ki hayatımdasın. Seni çok seviyorum.\n\n" +
    "Diyetisyen Gül Ödek\n" +
    "Doğum Günün Kutlu Olsun 🎉🤍";


// Partikül Tipleri
interface Particle {
    id: number;
    type: 'projectile' | 'firework' | 'star';
    className?: string; // Ekstra sınıf (strip, shard, bit vb.)
    style: React.CSSProperties;
}

const GiftSurprise: React.FC<GiftSurpriseProps> = ({ isActive, onComplete }) => {
    const [isOpened, setIsOpened] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    // Efekt State'leri
    const [particles, setParticles] = useState<Particle[]>([]);
    const [stars, setStars] = useState<React.CSSProperties[]>([]);
    const [hearts, setHearts] = useState<React.CSSProperties[]>([]);

    // 1. BAŞLANGIÇ: Sahne Kurulumu (Yıldızlar & Kalpler) + SCROLL KİLİTLEME
    useEffect(() => {
        if (!isActive) return;

        // --- SCROLL KİLİTLEME (Body'ye overflow hidden ekler) ---
        document.body.style.overflow = 'hidden';

        // A) Arka Plan Yıldızları
        const newStars = Array.from({ length: 100 }).map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4}px`,
            height: `${Math.random() * 4}px`,
            animationDelay: `${Math.random() * 3}s`
        }));
        setStars(newStars);

        // B) Yüzen Kalpler
        const newHearts = Array.from({ length: 50 }).map(() => ({
            '--left': `${Math.random() * 100}%`,
            '--duration': `${4 + Math.random() * 6}s`,
            '--delay': `${Math.random() * 2}s`,
            '--sway': `${(Math.random() - 0.5) * 100}px`,
            '--rot': `${Math.random() * 360}deg`
        } as React.CSSProperties));
        setHearts(newHearts);

        // --- CLEANUP FUNCTION (Component kapanınca scroll kilidini açar) ---
        return () => {
            document.body.style.overflow = '';
        };

    }, [isActive]);

    if (!isActive) return null;

    // --- YENİLENEN FIRLATMA MOTORU (CANNON SYSTEM) ---
    const triggerCannons = () => {
        const newParticles: Particle[] = [];
        // Daha canlı, kağıt hissi veren renkler
        const colors = ['#FFD700', '#FF0055', '#00FFFF', '#39FF14', '#FFFFFF', '#FF5722', '#E040FB'];

        // Yeni "Konfeti" Şekilleri (Geometrik olmayan, kağıt parçası görünümlü)
        const shapes = ['gs-shape-strip', 'gs-shape-shard', 'gs-shape-bit'];

        // Responsive Kontrolü: Mobilde daha az mesafe ve daha az parçacık
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 40 : 80;

        // SOL TARAF TOPU (Left Cannon)
        for (let i = 0; i < particleCount; i++) {
            // Mobilde ekran dışına taşmaması için menzil daraltıldı
            const txBase = isMobile ? 50 : 200;
            const txRange = isMobile ? 150 : 600;
            const tyBase = isMobile ? -300 : -500;
            const tyRange = isMobile ? 400 : 800;

            const tx = txBase + Math.random() * txRange;
            const ty = tyBase - Math.random() * tyRange;
            const rot = Math.random() * 1440; // Çoklu takla

            newParticles.push({
                id: i,
                type: 'projectile',
                className: shapes[Math.floor(Math.random() * shapes.length)],
                style: {
                    left: isMobile ? '20px' : '50px',
                    bottom: isMobile ? '20px' : '50px',
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    // Düzensiz ince uzun boyutlar (Konfeti hissi)
                    width: `${6 + Math.random() * 8}px`,
                    height: `${10 + Math.random() * 10}px`,
                    '--tx': `${tx}px`,
                    '--ty': `${ty}px`,
                    '--rot': `${rot}deg`,
                    animation: `gs-projectile-launch ${2 + Math.random()}s cubic-bezier(0.12, 0.7, 0.25, 1) forwards`,
                    animationDelay: `${Math.random() * 0.3}s`
                } as React.CSSProperties
            });
        }

        // SAĞ TARAF TOPU (Right Cannon)
        for (let i = 0; i < particleCount; i++) {
            // Sağdan sola negatif atış
            const txBase = isMobile ? -50 : -200;
            const txRange = isMobile ? 150 : 600;
            const tyBase = isMobile ? -300 : -500;
            const tyRange = isMobile ? 400 : 800;

            const tx = txBase - Math.random() * txRange;
            const ty = tyBase - Math.random() * tyRange;
            const rot = Math.random() * 1440;

            newParticles.push({
                id: 1000 + i,
                type: 'projectile',
                className: shapes[Math.floor(Math.random() * shapes.length)],
                style: {
                    right: isMobile ? '20px' : '50px',
                    left: 'auto',
                    bottom: isMobile ? '20px' : '50px',
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    width: `${6 + Math.random() * 8}px`,
                    height: `${10 + Math.random() * 10}px`,
                    '--tx': `${tx}px`,
                    '--ty': `${ty}px`,
                    '--rot': `${rot}deg`,
                    animation: `gs-projectile-launch ${2 + Math.random()}s cubic-bezier(0.12, 0.7, 0.25, 1) forwards`,
                    animationDelay: `${Math.random() * 0.3}s`
                } as React.CSSProperties
            });
        }

        // Havai Fişekler (Merkez)
        const fireworkCount = isMobile ? 30 : 100;
        for (let i = 0; i < fireworkCount; i++) {
            const angle = Math.random() * 360;
            const velocity = (isMobile ? 150 : 250) + Math.random() * (isMobile ? 150 : 350);
            newParticles.push({
                id: 2000 + i,
                type: 'firework',
                style: {
                    left: '50%',
                    top: '30%',
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    '--tx': `${Math.cos(angle * Math.PI / 180) * velocity}px`,
                    '--ty': `${Math.sin(angle * Math.PI / 180) * velocity}px`,
                    animation: `gs-explode-particle 1.2s cubic-bezier(0, .9, .57, 1) forwards`
                } as React.CSSProperties
            });
        }

        setParticles(newParticles);
    };

    const handleOpen = () => {
        if (isOpened) return;

        setIsOpened(true);

        // Beklenti Süresi (Anticipation)
        setTimeout(() => {
            triggerCannons();
        }, 500);

        // Kartın Girişi
        setTimeout(() => {
            setShowCard(true);
        }, 1500);
    };

    const handleClose = () => {
        setIsFadingOut(true);

        window.scrollTo({
            top: 0,
            behavior: 'auto' // 'smooth' yapmadık ki anında geçsin
        });
        setTimeout(() => {
            onComplete();
            // Garanti olsun diye component tamamen kalktıktan sonra bir daha tetikle
            window.scrollTo(0, 0);
        }, 1500);
    };

    return (
        <div className={`gs-overlay ${isFadingOut ? 'gs-fade-out' : ''}`}>

            {/* KATMAN 0: Atmosfer */}
            <div className="gs-god-rays"></div>
            {stars.map((style, i) => <div key={i} className="gs-star" style={style} />)}
            {hearts.map((style, i) => <div key={i} className="gs-heart" style={style}>🤍</div>)}

            {/* 1. KONFETİ TOPLARI (WRAPPER SİSTEMİ) */}
            {/* SOL TOP: Wrapper içinde ScaleX(-1) */}
            <div className="gs-cannon-wrapper gs-cannon-left">
                <div className={`gs-cannon-inner ${isOpened ? 'gs-cannon-fire' : ''}`}>
                    🎉
                </div>
            </div>

            {/* SAĞ TOP: Normal */}
            <div className="gs-cannon-wrapper gs-cannon-right">
                <div className={`gs-cannon-inner ${isOpened ? 'gs-cannon-fire' : ''}`}>
                    🎉
                </div>
            </div>

            {/* 2. PARTİKÜLLER */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className={
                        p.type === 'projectile'
                            ? `gs-projectile ${p.className}`
                            : 'gs-firework'
                    }
                    style={p.style}
                />
            ))}

            {/* 3. HEDİYE KUTUSU */}
            {!showCard && (
                <div
                    className={`gs-gift-wrapper ${isOpened ? 'gs-open' : ''}`}
                    onClick={handleOpen}
                >
                    <div className="gs-lid"><div className="gs-ribbon vertical"></div></div>
                    <div className="gs-box">
                        <div className="gs-ribbon vertical"></div>
                        <div className="gs-ribbon horizontal"></div>
                    </div>
                </div>
            )}

            {/* 4. KART */}
            <div className={`gs-card-container ${showCard ? 'gs-visible' : ''}`}>
                <h1 className="gs-title">{NOTE_TITLE}</h1>
                <p className="gs-message note-body">{NOTE_BODY}</p>
                <button className="gs-action-btn" onClick={handleClose}>
                    Siteye Gir
                </button>
            </div>

        </div>
    );
};

export default GiftSurprise;