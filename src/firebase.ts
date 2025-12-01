// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // EKLENDİ

// İlerde Auth için buraya ekleme yapacağız: import { getAuth } from "firebase/auth";

// Buraları kendi Firebase konsolundan aldığın bilgilerle doldurman ŞART!
// Kopyaladığın kodda bu bilgiler tırnak içinde yazar.

const firebaseConfig = {
    apiKey: "AIzaSyAT_-PKN7hQJRbrVSb2XC91NWXYjFb8vQo",
    authDomain: "diyetisyenwebsitesi.firebaseapp.com",
    projectId: "diyetisyenwebsitesi",
    storageBucket: "diyetisyenwebsitesi.firebasestorage.app",
    messagingSenderId: "925941592188",
    appId: "1:925941592188:web:05b91a67769a64ede919f9",
    measurementId: "G-HXY8J3NN82"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // EKLENDİ: Artık kimlik doğrulama servisini dışa aktarıyoruz


