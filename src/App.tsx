// src/App.tsx
import Appointment from './components/Appointment';
import React, { useState, useEffect } from 'react';
// Router
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
// Animasyon Kütüphanesi
import { AnimatePresence } from 'framer-motion';
// Firebase
import { db, auth } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';
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
import ScrollToTop from './components/ScrollToTop'; // Yukarı kaydırma bileşeni
import PageTransition from './components/PageTransition'; // Animasyon bileşeni

// Tipler
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
  const diyetisyenAdi = "Uzman Diyetisyen Gül Ödek";

  const location = useLocation();
  const navigate = useNavigate();

  // --- STATE'LER ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // --- 1. AUTH VE VERİ ÇEKME ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setIsAuthChecking(false);
    });

    const qBlog = query(collection(db, "blog-posts"), orderBy("dateMs", "desc"));
    const unsubBlog = onSnapshot(qBlog, (s) => setBlogPosts(s.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost))));

    const qRecipe = query(collection(db, "recipes"), orderBy("createdAt", "desc"));
    const unsubRecipe = onSnapshot(qRecipe, (s) => setRecipes(s.docs.map(d => ({ id: d.id, ...d.data() } as Recipe))));

    return () => { unsubscribeAuth(); unsubBlog(); unsubRecipe(); };
  }, []);

  // --- FONKSİYONLAR ---

  const handleLogout = async () => {
    await signOut(auth);
    alert("Başarıyla çıkış yapıldı.");
  };

  const addBlogPost = async (newPost: Omit<BlogPost, 'id' | 'date'>) => {
    try {
      await addDoc(collection(db, "blog-posts"), { ...newPost, imageUrl: newPost.imageUrl || null, date: new Date().toLocaleDateString('tr-TR'), dateMs: Date.now() });
      alert("✅ Blog yazısı eklendi!");
    } catch (error) { alert("Hata: " + (error as any).message); }
  };

  const addRecipe = async (newRecipe: Omit<Recipe, 'id'>) => {
    try {
      await addDoc(collection(db, "recipes"), { ...newRecipe, imageUrl: newRecipe.image || null, createdAt: Date.now() });
      alert("✅ Tarif eklendi!");
    } catch (error) { alert("Hata: " + (error as any).message); }
  };

  const updateBlogPost = async (id: string, updatedPost: Partial<BlogPost>) => {
    try {
      const docRef = doc(db, "blog-posts", id);
      const cleanData = JSON.parse(JSON.stringify(updatedPost));
      await updateDoc(docRef, cleanData);
      alert("✅ Blog güncellendi!");
    } catch (error) { console.error(error); alert("Hata oluştu."); }
  };

  const updateRecipe = async (id: string, updatedRecipe: Partial<Recipe>) => {
    try {
      const docRef = doc(db, "recipes", id);
      const cleanData = JSON.parse(JSON.stringify(updatedRecipe));
      await updateDoc(docRef, cleanData);
      alert("✅ Tarif güncellendi!");
    } catch (error) { console.error(error); alert("Hata oluştu."); }
  };

  if (isAuthChecking) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#6c7e3a' }}><h2>Yükleniyor...</h2></div>;

  const isAdminPage = location.pathname === '/admin';
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      <ScrollToTop /> {/* Sayfa değişince en üste atar */}

      {!isLoginPage && (
        <>
          {!isAdminPage && <Announcement message="🎁 Yeni Online Diyet Paketi Avantajlı Fiyatlarla Başladı!" />}
          <Header diyetisyenAdi={diyetisyenAdi} onLogout={handleLogout} isAdminLinkVisible={isLoggedIn} isAdminPage={isAdminPage} />
        </>
      )}

      {/* Animasyonlu Geçişler İçin Wrapper */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* 1. ANA SAYFA */}
          <Route path="/" element={
            <PageTransition>
              <main>
                <Hero />

                {/* ÖZELLİKLER BÖLÜMÜ */}
                <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#fff' }}>
                  <h2 style={{ color: '#6c7e3a', fontSize: '28px', marginBottom: '40px', fontWeight: '700' }}>Neden Diyetisyen Gül Ödek?</h2>
                  <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '40px' }}>
                    <div style={{ maxWidth: '300px' }}>
                      <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔬</div>
                      <h3 style={{ color: '#2d3748', marginBottom: '10px', fontSize: '20px' }}>Bilimsel Yaklaşım</h3>
                      <p style={{ color: '#718096', lineHeight: '1.6' }}>Hurafelerden uzak, kanıta dayalı beslenme bilimi ile sağlığınızı riske atmadan yönetiyoruz.</p>
                    </div>
                    <div style={{ maxWidth: '300px' }}>
                      <div style={{ fontSize: '40px', marginBottom: '15px' }}>🥗</div>
                      <h3 style={{ color: '#2d3748', marginBottom: '10px', fontSize: '20px' }}>Sürdürülebilir Beslenme</h3>
                      <p style={{ color: '#718096', lineHeight: '1.6' }}>Yasaklar listesi değil, hayat boyu uygulayabileceğiniz sağlıklı alışkanlıklar kazandırıyoruz.</p>
                    </div>
                    <div style={{ maxWidth: '300px' }}>
                      <div style={{ fontSize: '40px', marginBottom: '15px' }}>📱</div>
                      <h3 style={{ color: '#2d3748', marginBottom: '10px', fontSize: '20px' }}>Online Takip</h3>
                      <p style={{ color: '#718096', lineHeight: '1.6' }}>Her an yanınızdayız. WhatsApp ve online görüşmelerle motivasyonunuz hiç düşmesin.</p>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '60px 20px', background: 'transparent' }}>
                  {/* <h2 style={{ textAlign: 'center', color: '#6c7e3a', marginBottom: '10px' }}>Mutfaktan Lezzetli Kareler</h2>
                  <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>Diyet yaparken lezzetten ödün vermeyin.</p> */}
                  <Recipes recipes={recipes} />
                  <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    {/* <button
                      onClick={() => navigate('/icerik')}
                      style={{ padding: '14px 35px', backgroundColor: '#6c7e3a', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      Tüm Tarif ve Yazıları Gör →
                    </button> */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '1px',
                      paddingTop: '1px'
                    }}>
                      <button
                        onClick={() => navigate('/icerik')}
                        style={{
                          background: 'transparent',
                          border: '3px solid #2d3748', /* Çerçeveli modern buton */
                          color: '#2d3748',
                          padding: '12px 30px',
                          borderRadius: '50px',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#2d3748';
                          e.currentTarget.style.color = '#fff';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#2d3748';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        Tüm İçerikleri Keşfet <span style={{ fontSize: '18px' }}>→</span>
                      </button>
                    </div>

                    {/* <div style={{ padding: '60px 20px', textAlign: 'center', background: '#f9f9f9' }}>
                  <h2 style={{ color: '#6c7e3a', marginBottom: '10px' }}>Size Nasıl Yardımcı Olabilirim?</h2>
                  <p style={{ color: '#666', marginBottom: '40px' }}>Hedeflerinize ulaşmanız için bilimsel ve sürdürülebilir çözümler.</p>
                  <Services />
                </div> */}

                    <div style={{ margin: '60px 0' }}>
                      <BodyAnalysis />
                    </div>


                  </div>
                </div>

                <Testimonials />
              </main>
            </PageTransition>
          } />

          {/* 2. HAKKIMDA */}
          <Route path="/hakkimda" element={
            <PageTransition>
              <main>
                <About egitimBilgisi="Kırklareli Üniversitesi Beslenme ve Diyetetik Bölümü mezunuyum." />
              </main>
            </PageTransition>
          } />

          {/* 3. HİZMETLER & ARAÇLAR */}
          <Route path="/hizmetler" element={
            <PageTransition>
              <main>
                <div style={{ marginTop: '40px' }}>
                  <Services />
                </div>
                <Calculator />
              </main>
            </PageTransition>
          } />

          {/* 4. İÇERİK */}
          <Route path="/icerik" element={
            <PageTransition>
              <main>
                <Recipes recipes={recipes} />
                <div style={{ marginTop: '60px' }}>
                  <BlogList posts={blogPosts} />
                </div>
              </main>
            </PageTransition>
          } />

          {/* 5. İLETİŞİM */}
          <Route path="/iletisim" element={
            <PageTransition>
              <main>
                <Contact />
                <FAQ />
              </main>
            </PageTransition>
          } />

          {/* 6. LOGIN */}
          <Route path="/login" element={
            isLoggedIn ? <Navigate to="/admin" /> : (
              <PageTransition>
                <Login onLoginSuccess={() => { }} onNavigate={() => navigate('/')} />
              </PageTransition>
            )
          } />

          <Route path="/randevu" element={
            <PageTransition>
              <main>
                <Appointment />
              </main>
            </PageTransition>
          } />

          {/* 7. ADMIN PANELİ */}
          <Route path="/admin" element={
            isLoggedIn ? (
              <PageTransition>
                <AdminDashboard
                  onAddPost={addBlogPost}
                  blogPosts={blogPosts}
                  onUpdatePost={updateBlogPost}
                  onAddRecipe={addRecipe}
                  onUpdateRecipe={updateRecipe}
                  recipes={recipes}
                />
              </PageTransition>
            ) : (<Navigate to="/login" />)
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>

      {!isAdminPage && !isLoginPage && (<><Footer diyetisyenAdi={diyetisyenAdi} telifHakkiYili={currentYear} /><WhatsAppButton /></>)}
    </>
  );
};

export default App;