// src/components/AdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, Timestamp, deleteField, where, getDocs, addDoc } from 'firebase/firestore'; import type { BlogPost, Recipe } from '../App.tsx';

interface AdminDashboardProps {
    onAddPost: (newPost: Omit<BlogPost, 'id' | 'date'>) => Promise<void>;
    blogPosts: BlogPost[];
    // YENİ: Güncelleme Fonksiyonu
    onUpdatePost: (id: string, data: Partial<BlogPost>) => Promise<void>;

    onAddRecipe: (newRecipe: Omit<Recipe, 'id'>) => Promise<void>;
    recipes: Recipe[];
    // YENİ: Güncelleme Fonksiyonu
    onUpdateRecipe: (id: string, data: Partial<Recipe>) => Promise<void>;
}

interface Message {
    id: string;
    name: string;
    email: string;
    phone?: string; // İsteğe bağlı telefon alanı
    message: string;
    createdAt: any;
}

interface Appointment {
    id: string;
    clientName: string;
    clientPhone: string;
    clientNote?: string; // İsteğe bağlı not alanı
    service: string;
    date: string;
    time: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: any;
}

interface Testimonial {
    id: string;
    name: string;
    comment: string;
    rating: number;
    date?: any;
    reply?: string;
    replyDate?: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
    onAddPost, blogPosts, onUpdatePost,
    onAddRecipe, recipes, onUpdateRecipe
}) => {
    // 1. activeTab satırını bununla değiştirin (içine 'appointments' eklendi):
    const [activeTab, setActiveTab] = useState<'messages' | 'testimonials' | 'blog' | 'recipes' | 'appointments'>('messages');

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    // --- BLOG STATE ---
    const [blogId, setBlogId] = useState<string | null>(null); // Düzenleme Modu için ID
    const [blogTitle, setBlogTitle] = useState('');
    const [blogExcerpt, setBlogExcerpt] = useState('');
    const [blogContent, setBlogContent] = useState('');
    const [blogImage, setBlogImage] = useState('');

    // --- TARİF STATE ---
    const [recId, setRecId] = useState<string | null>(null); // Düzenleme Modu için ID
    const [recTitle, setRecTitle] = useState('');
    const [recCategory, setRecCategory] = useState('Tatlı');
    const [recCalories, setRecCalories] = useState('');
    const [recImage, setRecImage] = useState('');
    const [recIngredients, setRecIngredients] = useState('');
    const [recPreparation, setRecPreparation] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Yorum Cevaplama
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    // Verileri Çek
    useEffect(() => {
        const qMessages = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const unsubMessages = onSnapshot(qMessages, (s) => setMessages(s.docs.map(d => ({ id: d.id, ...d.data() } as Message))));

        const qTestimonials = query(collection(db, "testimonials"), orderBy("date", "desc"));
        const unsubTestimonials = onSnapshot(qTestimonials, (s) => setTestimonials(s.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial))));


        const qAppointments = query(collection(db, "appointments"), orderBy("date", "asc"));
        const unsubAppointments = onSnapshot(qAppointments, (s) => setAppointments(s.docs.map(d => ({ id: d.id, ...d.data() } as Appointment))));

        return () => { unsubMessages(); unsubTestimonials(); unsubAppointments(); };
    }, []);

    // --- GENEL SİLME FONKSİYONU (Düzeltilmiş Tek Versiyon) ---
    // Bu fonksiyon hem normal silme yapar hem de randevu silinirse takvimi temizler.
    const handleDelete = async (col: string, id: string) => {
        if (window.confirm("Bu öğeyi kalıcı olarak silmek istediğinize emin misiniz?")) {
            try {
                // 1. Önce asıl veriyi sil
                await deleteDoc(doc(db, col, id));

                // 2. Eğer silinen şey bir 'randevu' ise, takvimdeki (booked_slots) kaydını da bul ve sil
                if (col === 'appointments') {
                    const q = query(collection(db, "booked_slots"), where("appointmentId", "==", id));
                    const snapshot = await getDocs(q);
                    snapshot.forEach(async (d) => {
                        await deleteDoc(d.ref);
                    });
                }
            } catch (e) {
                console.error(e);
                alert("Silinirken bir hata oluştu.");
            }
        }
    };

    // --- RANDEVU YÖNETİMİ (GÜNCELLENDİ: Senkronizasyonlu) ---
    const handleAppointmentStatus = async (appointment: Appointment, newStatus: 'approved' | 'rejected') => {
        try {
            // 1. Ana randevu tablosunu güncelle
            await updateDoc(doc(db, "appointments", appointment.id), { status: newStatus });

            // 2. Eğer ONAYLANDIYSA -> 'booked_slots' tablosuna ekle (Takvimi kapat)
            if (newStatus === 'approved') {
                await addDoc(collection(db, "booked_slots"), {
                    date: appointment.date,
                    time: appointment.time,
                    appointmentId: appointment.id // Bağlantı için ID'yi tutuyoruz
                });
            }
            // 3. Eğer REDDEDİLDİYSE -> 'booked_slots' tablosundan sil (Takvimi aç)
            else if (newStatus === 'rejected') {
                const q = query(collection(db, "booked_slots"), where("appointmentId", "==", appointment.id));
                const snapshot = await getDocs(q);
                snapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });
            }

            alert(newStatus === 'approved' ? "Randevu Onaylandı ve Takvim Kapatıldı! ✅" : "Randevu Reddedildi ve Takvim Açıldı. ❌");
        } catch (error) {
            console.error(error);
            alert("Hata oluştu.");
        }
    };


    // --- YORUM İŞLEMLERİ ---
    const handleDeleteReply = async (id: string) => {
        if (window.confirm("Sadece cevabınızı silmek istediğinize emin misiniz?")) {
            try {
                const testimonialRef = doc(db, "testimonials", id);
                await updateDoc(testimonialRef, {
                    reply: deleteField(),
                    replyDate: deleteField()
                });
                alert("Cevap silindi.");
            } catch (error) {
                console.error(error);
                alert("Hata oluştu.");
            }
        }
    };

    const handleEditReply = (t: Testimonial) => {
        setReplyingTo(t.id);
        setReplyText(t.reply || '');
    };

    const handleReplySubmit = async (id: string) => {
        if (!replyText.trim()) return;
        try {
            await updateDoc(doc(db, "testimonials", id), { reply: replyText, replyDate: Timestamp.now() });
            setReplyText(''); setReplyingTo(null); alert("Cevap güncellendi!");
        } catch (error) { alert("Hata oluştu."); }
    };

    // --- BLOG İŞLEMLERİ ---

    // Düzenlemeyi Başlat
    const startEditBlog = (post: BlogPost) => {
        setBlogId(post.id);
        setBlogTitle(post.title);
        setBlogExcerpt(post.excerpt);
        setBlogContent(post.content);
        setBlogImage(post.imageUrl || '');
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Formun başına git
    };

    // Düzenlemeyi İptal Et
    const cancelEditBlog = () => {
        setBlogId(null);
        setBlogTitle('');
        setBlogExcerpt('');
        setBlogContent('');
        setBlogImage('');
    };

    const handleBlogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const blogData = {
                title: blogTitle,
                excerpt: blogExcerpt,
                content: blogContent,
                imageUrl: blogImage || undefined
            };

            if (blogId) {
                // Güncelleme Modu
                await onUpdatePost(blogId, blogData);
            } else {
                // Yeni Ekleme Modu
                await onAddPost(blogData);
            }

            cancelEditBlog(); // Formu temizle
        } catch (e) { console.error(e); }
        finally { setIsSubmitting(false); }
    };

    // --- TARİF İŞLEMLERİ ---

    // Düzenlemeyi Başlat
    const startEditRecipe = (rec: Recipe) => {
        setRecId(rec.id);
        setRecTitle(rec.title);
        setRecCategory(rec.category);
        setRecCalories(rec.calories.toString());
        setRecImage(rec.image || '');
        setRecIngredients(rec.ingredients.join('\n')); // Array'i string'e çevir
        setRecPreparation(rec.preparation);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Düzenlemeyi İptal Et
    const cancelEditRecipe = () => {
        setRecId(null);
        setRecTitle('');
        setRecCategory('Tatlı');
        setRecCalories('');
        setRecImage('');
        setRecIngredients('');
        setRecPreparation('');
    };

    const handleRecipeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const ingredientsArray = recIngredients.split('\n').filter(line => line.trim() !== '');
            const recipeData = {
                title: recTitle,
                category: recCategory,
                calories: Number(recCalories) || 0,
                image: recImage,
                ingredients: ingredientsArray,
                preparation: recPreparation
            };

            if (recId) {
                // Güncelleme
                await onUpdateRecipe(recId, recipeData);
            } else {
                // Yeni Ekleme
                await onAddRecipe(recipeData);
            }

            cancelEditRecipe();
        } catch (e) { console.error(e); }
        finally { setIsSubmitting(false); }
    };

    const formatDate = (ts: any) => ts ? new Date(ts.seconds * 1000).toLocaleDateString('tr-TR') : '';

    return (
        <section className="admin-dashboard">
            <div className="admin-header">
                <h2>Yönetim Merkezi</h2>
                <div className="admin-tabs">
                    <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>📩 Mesajlar</button>
                    <button className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}>
                        📅 Randevular
                    </button>
                    <button className={activeTab === 'testimonials' ? 'active' : ''} onClick={() => setActiveTab('testimonials')}>💬 Yorumlar</button>
                    <button className={activeTab === 'blog' ? 'active' : ''} onClick={() => setActiveTab('blog')}>✍️ Blog</button>
                    <button className={activeTab === 'recipes' ? 'active' : ''} onClick={() => setActiveTab('recipes')}>🥗 Tarifler</button>
                </div>
            </div>

            <div className="admin-content">

                {/* MESAJLAR */}
                {activeTab === 'messages' && (
                    <div className="messages-list">
                        {messages.length === 0 ? <p className="empty-msg">Mesaj yok.</p> : messages.map(msg => (
                            <div key={msg.id} className="admin-card">
                                <div className="card-header">
                                    <strong>{msg.name}</strong>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className="email">{msg.email}</span>
                                        {/* YENİ: TELEFON NUMARASI GÖSTERİMİ */}
                                        {msg.phone && <div style={{ fontSize: '12px', color: '#7ab800', fontWeight: '600', marginTop: '4px' }}>{msg.phone}</div>}
                                    </div>
                                </div>

                                {/* KISALTILMIŞ METİN YERİNE DİREKT METİN (Scroll ile) */}
                                <p className="message-body">{msg.message}</p>

                                <div className="card-footer"><small>{formatDate(msg.createdAt)}</small><button className="delete-btn" onClick={() => handleDelete('messages', msg.id)}>Sil</button></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* RANDEVULAR */}
                {activeTab === 'appointments' && (
                    <div className="messages-list">
                        {appointments.length === 0 ? <p className="empty-msg">Randevu talebi yok.</p> : appointments.map(app => (
                            <div key={app.id} className={`admin-card appointment-card ${app.status}`}>
                                <div className="card-header">
                                    <strong>{app.clientName}</strong>
                                    <span className={`status-badge ${app.status}`}>
                                        {app.status === 'approved' ? 'ONAYLI' : app.status === 'rejected' ? 'RED' : 'BEKLİYOR'}
                                    </span>
                                </div>
                                <div className="app-details">
                                    <p><strong>Hizmet:</strong> {app.service}</p>
                                    <p><strong>Tarih:</strong> {app.date} / {app.time}</p>
                                    <p><strong>Tel:</strong> <a href={`tel:${app.clientPhone}`}>{app.clientPhone}</a></p>

                                    {/* GÜNCELLEME: MÜŞTERİ NOTU GÖSTERİMİ */}
                                    {app.clientNote && (
                                        <div className="note-preview">
                                            <strong>📝 Not:</strong> {app.clientNote}
                                        </div>
                                    )}

                                </div>
                                <div className="card-actions">
                                    {app.status === 'pending' && (
                                        <>
                                            <button className="approve-btn" onClick={() => handleAppointmentStatus(app, 'approved')}>✅ Onayla</button>
                                            <button className="reject-btn" onClick={() => handleAppointmentStatus(app, 'rejected')}>❌ Reddet</button>
                                        </>
                                    )}
                                    <button className="delete-btn" onClick={() => handleDelete('appointments', app.id)}>Sil</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* YORUMLAR */}
                {activeTab === 'testimonials' && (
                    <div className="testimonials-list">
                        {testimonials.length === 0 ? <p className="empty-msg">Henüz yorum yok.</p> : testimonials.map(t => (
                            <div key={t.id} className="admin-card">
                                <div className="card-header"><strong>{t.name}</strong> <span className="rating">{'★'.repeat(t.rating)}</span></div>
                                <p className="message-body">"{t.comment}"</p>

                                {t.reply && (
                                    <div className="admin-reply-preview">
                                        <strong>Cevabınız:</strong> {t.reply}
                                        <div style={{ marginTop: '5px', display: 'flex', gap: '10px' }}>
                                            <button className="edit-link" onClick={() => handleEditReply(t)}>Düzenle</button>
                                            <button className="delete-link" onClick={() => handleDeleteReply(t.id)}>Cevabı Sil</button>
                                        </div>
                                    </div>
                                )}

                                <div className="card-actions">
                                    {(!t.reply || replyingTo === t.id) && (
                                        <button className="reply-btn" onClick={() => { setReplyingTo(t.id === replyingTo ? null : t.id); setReplyText(t.reply || ''); }}>
                                            {replyingTo === t.id ? 'İptal' : 'Cevapla'}
                                        </button>
                                    )}
                                    <button className="delete-btn" onClick={() => handleDelete('testimonials', t.id)}>Yorumu Sil</button>
                                </div>

                                {replyingTo === t.id && (
                                    <div className="reply-form">
                                        <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Yanıtınız..." rows={3}></textarea>
                                        <button className="send-reply-btn" onClick={() => handleReplySubmit(t.id)}>
                                            {t.reply ? 'Güncelle' : 'Gönder'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* BLOG YÖNETİMİ */}
                {activeTab === 'blog' && (
                    <div className="blog-management">
                        <div className="add-blog-container">
                            <div className="form-header-row">
                                <h3>{blogId ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}</h3>
                                {blogId && <button onClick={cancelEditBlog} className="cancel-edit-btn">Vazgeç</button>}
                            </div>

                            <form onSubmit={handleBlogSubmit} className="mini-form">
                                <input type="text" placeholder="Başlık" value={blogTitle} onChange={e => setBlogTitle(e.target.value)} required />
                                <input type="text" placeholder="Özet" value={blogExcerpt} onChange={e => setBlogExcerpt(e.target.value)} required />
                                <textarea placeholder="İçerik..." rows={6} value={blogContent} onChange={e => setBlogContent(e.target.value)} required></textarea>
                                <input type="url" placeholder="Görsel URL" value={blogImage} onChange={e => setBlogImage(e.target.value)} />

                                <button type="submit" disabled={isSubmitting} className="submit-btn">
                                    {isSubmitting ? '...' : (blogId ? 'Güncelle' : 'Yayınla')}
                                </button>
                            </form>
                        </div>
                        <div className="existing-blogs">
                            <h3>Yazılar ({blogPosts.length})</h3>
                            {blogPosts.map(post => (
                                <div key={post.id} className="admin-card blog-mini-card">
                                    <span>{post.title}</span>
                                    <div className="mini-card-actions">
                                        <button className="edit-btn" onClick={() => startEditBlog(post)}>Düzenle</button>
                                        <button className="delete-btn" onClick={() => handleDelete('blog-posts', post.id)}>Sil</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TARİF YÖNETİMİ */}
                {activeTab === 'recipes' && (
                    <div className="blog-management">
                        <div className="add-blog-container">
                            <div className="form-header-row">
                                <h3>{recId ? 'Tarifi Düzenle' : 'Yeni Tarif Ekle'}</h3>
                                {recId && <button onClick={cancelEditRecipe} className="cancel-edit-btn">Vazgeç</button>}
                            </div>

                            <form onSubmit={handleRecipeSubmit} className="mini-form">
                                <input type="text" placeholder="Tarif Adı" value={recTitle} onChange={e => setRecTitle(e.target.value)} required />
                                <div className="form-row-split">
                                    <select value={recCategory} onChange={e => setRecCategory(e.target.value)}>
                                        <option value="Tatlı">Tatlı</option>
                                        <option value="İçecek">İçecek</option>
                                        <option value="Salata">Salata</option>
                                        <option value="Ana Yemek">Ana Yemek</option>
                                        <option value="Atıştırmalık">Atıştırmalık</option>
                                    </select>
                                    <input type="number" placeholder="Kalori" value={recCalories} onChange={e => setRecCalories(e.target.value)} />
                                </div>
                                <textarea placeholder="Malzemeler (Her satıra bir tane)" rows={5} value={recIngredients} onChange={e => setRecIngredients(e.target.value)} required></textarea>
                                <textarea placeholder="Hazırlanışı" rows={5} value={recPreparation} onChange={e => setRecPreparation(e.target.value)} required></textarea>
                                <input type="url" placeholder="Fotoğraf URL" value={recImage} onChange={e => setRecImage(e.target.value)} />

                                <button type="submit" disabled={isSubmitting} className="submit-btn">
                                    {isSubmitting ? '...' : (recId ? 'Güncelle' : 'Ekle')}
                                </button>
                            </form>
                        </div>
                        <div className="existing-blogs">
                            <h3>Tarifler ({recipes.length})</h3>
                            {recipes.map(rec => (
                                <div key={rec.id} className="admin-card blog-mini-card">
                                    <div><strong>{rec.title}</strong><div style={{ fontSize: '12px', color: '#7ab800' }}>{rec.category}</div></div>
                                    <div className="mini-card-actions">
                                        <button className="edit-btn" onClick={() => startEditRecipe(rec)}>Düzenle</button>
                                        <button className="delete-btn" onClick={() => handleDelete('recipes', rec.id)}>Sil</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


            </div>
        </section>
    );
};

export default AdminDashboard;