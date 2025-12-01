// src/components/Announcement.tsx

import React, { useState } from 'react';
import './Announcement.css';

interface AnnouncementProps {
    message: string;
}

const Announcement: React.FC<AnnouncementProps> = ({ message }) => {
    // Duyuruyu kapatmak için state kullanıyoruz
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
        return null; // Görünür değilse hiçbir şey render etme
    }

    return (
        <div className="announcement-bar">
            <p className="announcement-message">{message}</p>
            {/* Kapatma butonu */}
            <button
                className="close-button"
                onClick={() => setIsVisible(false)}
                aria-label="Duyuruyu kapat"
            >
                &times;
            </button>
        </div>
    );
};

export default Announcement;