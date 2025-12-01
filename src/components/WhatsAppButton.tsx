// src/components/WhatsAppButton.tsx

import React from 'react';
import './WhatsAppButton.css';

const WhatsAppButton: React.FC = () => {
    // Telefon numaranı uluslararası formatta (başında + olmadan) buraya yaz
    // Örnek: 905551234567
    const phoneNumber = "905462665508";
    const message = "Merhaba, online diyet hakkında bilgi almak istiyorum.";

    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="whatsapp-container" onClick={handleClick}>
            <div className="whatsapp-icon">
                {/* WhatsApp SVG İkonu */}
                <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.973.588 1.908.944 3.031.944 3.181 0 5.768-2.587 5.768-5.766.001-3.181-2.585-5.768-5.766-5.768zm0 10.379c-1.027 0-1.887-.306-2.764-.819l-.198-.116-1.597.419.426-1.558-.131-.209c-.581-.929-.93-1.837-.93-2.87 0-2.543 2.068-4.611 4.61-4.611 2.541 0 4.609 2.068 4.609 4.611 0 2.543-2.068 4.611-4.61 4.611z" />
                    <path d="M12.049 4c-4.378 0-7.939 3.562-7.939 7.939 0 1.67.526 3.045 1.282 4.25l-1.392 5.081 5.216-1.368c1.13.572 2.415.972 3.999.972 4.378 0 7.939-3.562 7.939-7.939 0-4.377-3.561-7.939-7.939-7.939zm0 14.689c-1.467 0-2.705-.376-3.755-.969l-3.525.925.941-3.437c-.691-1.129-1.191-2.433-1.191-4.054 0-3.722 3.028-6.75 6.75-6.75 3.721 0 6.749 3.028 6.749 6.75 0 3.722-3.028 6.75-6.749 6.75z" />
                </svg>
            </div>
            <span className="whatsapp-text">WhatsApp Hattı</span>
        </div>
    );
};

export default WhatsAppButton;