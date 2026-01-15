import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Sayfa yolu (pathname) her değiştiğinde pencereyi en tepeye kaydır
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Animasyonlu değil, anında yukarı atsın ki yeni sayfa animasyonu başlasın
        });
    }, [pathname]);

    return null;
}

export default ScrollToTop;