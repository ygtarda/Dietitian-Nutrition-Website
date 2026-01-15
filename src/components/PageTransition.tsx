// src/components/PageTransition.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
    children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} // Başlangıç: Görünmez ve 20px aşağıda
            animate={{ opacity: 1, y: 0 }}  // Bitiş: Görünür ve olması gereken yerde
            exit={{ opacity: 0, y: -20 }}   // Çıkış: Görünmez ve 20px yukarı gider
            transition={{ duration: 0.4, ease: "easeOut" }} // 0.4 saniyede yumuşakça gerçekleşsin
            style={{ width: '100%' }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;