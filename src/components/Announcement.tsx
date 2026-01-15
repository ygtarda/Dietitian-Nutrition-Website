// src/components/Announcement.tsx
import React, { useState } from 'react';
import './Announcement.css';

interface AnnouncementProps {
    message: string;
}

const Announcement: React.FC<AnnouncementProps> = ({ message }) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="announcement-bar">
            <div className="announcement-content">
                <span>{message}</span>
            </div>
            <button className="close-announcement" onClick={() => setIsVisible(false)}>
                &times;
            </button>
        </div>
    );
};

export default Announcement;