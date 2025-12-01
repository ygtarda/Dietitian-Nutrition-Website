// src/App.tsx

import React, { useState, useEffect } from 'react';
// Router Kütüphanesi (useNavigate EKLENDİ)
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
// Firebase
import { db, auth } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Bileşenler
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Calculator from './components/Calculator';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import BlogList from './components/BlogList';
import Testimonials from './components/Testimonials';
import Login from './components/Login';
import Announcement from './components/Announcement';
import FAQ from './components/FAQ';
import Recipes from './components/Recipes';
import BodyAnalysis from './components/BodyAnalysis';
import WhatsAppButton from './components/WhatsAppButton';

// Tip Tanımları
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  imageUrl?: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: string;
  calories: number;
  image: string;
  ingredients: string[];
  preparation: string;
}

const App: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const diyetisyenAdi = "Uzman Diyetisyen Elif Yılmaz";

  const location = useLocation(); // Mevcut sayfa yolunu al
  const navigate = useNavigate(); // Yönlendirme fonksiyonunu al (YENİ EKLENDİ)

  // --- STATE'LER ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true); // Yükleniyor kontrolü

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // --- 1. AUTH VE VERİ ÇEKME ---
  useEffect(() => {
    // Oturum durumunu dinle
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // user varsa true, yoksa false
      setIsAuthChecking(false); // Kontrol bitti
    });

    // Blogları Çek
    const qBlog = query(collection(db, "blog-posts"), orderBy("dateMs", "desc"));
    const unsubBlog = onSnapshot(qBlog, (s) => setBlogPosts(s.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost))));

    // Tarifleri Çek
    const qRecipe = query(collection(db, "recipes"), orderBy("createdAt", "desc"));
    const unsubRecipe = onSnapshot(qRecipe, (s) => setRecipes(s.docs.map(d => ({ id: d.id, ...d.data() } as Recipe))));

    return () => { unsubscribeAuth(); unsubBlog(); unsubRecipe(); };
  }, []);

  // --- FONKSİYONLAR ---

  const handleLogout = async () => {
    await signOut(auth);
    // Router yönlendirmesi Navigate bileşeni ile yapılacak
    alert("Başarıyla çıkış yapıldı.");
  };

  const addBlogPost = async (newPost: Omit<BlogPost, 'id' | 'date'>) => {
    try {
      await addDoc(collection(db, "blog-posts"), {
        ...newPost,
        imageUrl: newPost.imageUrl || null,
        date: new Date().toLocaleDateString('tr-TR'),
        dateMs: Date.now()
      });
      alert("✅ Blog yazısı başarıyla yayınlandı!");
    } catch (error) {
      alert("Hata oluştu: " + (error as any).message);
    }
  };

  const addRecipe = async (newRecipe: Omit<Recipe, 'id'>) => {
    try {
      await addDoc(collection(db, "recipes"), {
        ...newRecipe,
        imageUrl: newRecipe.image || null,
        createdAt: Date.now()
      });
      alert("✅ Tarif başarıyla eklendi!");
    } catch (error) {
      alert("Hata oluştu: " + (error as any).message);
    }
  };

  // Yükleniyor ekranı (Firebase yanıt verene kadar bekle)
  if (isAuthChecking) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#6c7e3a' }}>
        <h2>Yükleniyor...</h2>
      </div>
    );
  }

  // Sayfa Kontrolleri
  const isAdminPage = location.pathname === '/admin';
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {/* Login sayfası haricinde Header'ı göster */}
      {!isLoginPage && (
        <>
          {/* Duyuruyu sadece normal sayfalarda göster, admin panelinde gizle */}
          {!isAdminPage && <Announcement message="🎁 Yeni Online Diyet Paketi Avantajlı Fiyatlarla Başladı!" />}

          <Header
            diyetisyenAdi={diyetisyenAdi}
            onLogout={handleLogout}
            isAdminLinkVisible={isLoggedIn}
            isAdminPage={isAdminPage}
          />
        </>
      )}

      {/* --- SAYFA YÖNLENDİRMELERİ (ROUTES) --- */}
      <Routes>

        {/* 1. ANA SAYFA */}
        <Route path="/" element={
          <main>
            <Hero />
            {/* Ana sayfada özet gösterim */}
            <div style={{ padding: '60px 20px', textAlign: 'center', background: '#f9f9f9' }}>
              <h2 style={{ color: '#6c7e3a', marginBottom: '10px' }}>Size Nasıl Yardımcı Olabilirim?</h2>
              <p style={{ color: '#666', marginBottom: '40px' }}>Hedeflerinize ulaşmanız için bilimsel ve sürdürülebilir çözümler.</p>
              <Services />
            </div>
            <Testimonials />
          </main>
        } />

        {/* 2. HAKKIMDA SAYFASI */}
        <Route path="/hakkimda" element={
          <main>
            <About egitimBilgisi="Hacettepe Üniversitesi Beslenme ve Diyetetik Bölümü mezunuyum." />
          </main>
        } />

        {/* 3. HİZMETLER & ARAÇLAR SAYFASI */}
        <Route path="/hizmetler" element={
          <main>
            <Services />
            <div style={{ margin: '40px 0' }}>
              <BodyAnalysis />
            </div>
            <Calculator />
          </main>
        } />

        {/* 4. İÇERİK (BLOG & TARİFLER) SAYFASI */}
        <Route path="/icerik" element={
          <main>
            <Recipes recipes={recipes} />
            <div style={{ marginTop: '60px' }}>
              <BlogList posts={blogPosts} />
            </div>
          </main>
        } />

        {/* 5. İLETİŞİM SAYFASI */}
        <Route path="/iletisim" element={
          <main>
            <Contact />
            <FAQ />
          </main>
        } />

        {/* 6. LOGIN SAYFASI (BURASI DÜZELTİLDİ) */}
        <Route path="/login" element={
          isLoggedIn ? (
            <Navigate to="/admin" />
          ) : (
            <Login
              onLoginSuccess={() => { }}
              onNavigate={() => navigate('/')} /* ARTIK ANA SAYFAYA YÖNLENDİRİYOR */
            />
          )
        } />

        {/* 7. ADMIN PANELİ (Korumalı Rota) */}
        <Route path="/admin" element={
          // Giriş yapmışsa paneli göster, yapmamışsa Login'e at
          isLoggedIn ? (
            <AdminDashboard
              onAddPost={addBlogPost}
              blogPosts={blogPosts}
              onAddRecipe={addRecipe}
              recipes={recipes}
            />
          ) : (
            <Navigate to="/login" />
          )
        } />

        {/* Bilinmeyen bir linke girilirse Ana Sayfaya at */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

      {/* Login ve Admin sayfası haricinde Footer ve WhatsApp göster */}
      {!isAdminPage && !isLoginPage && (
        <>
          <Footer diyetisyenAdi={diyetisyenAdi} telifHakkiYili={currentYear} />
          <WhatsAppButton />
        </>
      )}
    </>
  );
};

export default App;