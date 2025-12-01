// src/components/AdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, Timestamp, deleteField } from 'firebase/firestore';
import type { BlogPost, Recipe } from '../App.tsx';

interface AdminDashboardProps {
    onAddPost: (newPost: Omit<BlogPost, 'id' | 'date'>) => Promise<void>;
    blogPosts: BlogPost[];
    onAddRecipe: (newRecipe: Omit<Recipe, 'id'>) => Promise<void>;
    recipes: Recipe[];
}

interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
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

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onAddPost, blogPosts, onAddRecipe, recipes }) => {
    const [activeTab, setActiveTab] = useState<'messages' | 'testimonials' | 'blog' | 'recipes'>('messages');

    const [messages, setMessages] = useState<Message[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    // Blog Form
    const [blogTitle, setBlogTitle] = useState('');
    const [blogExcerpt, setBlogExcerpt] = useState('');
    const [blogContent, setBlogContent] = useState('');
    const [blogImage, setBlogImage] = useState('');

    // Tarif Form
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

        return () => { unsubMessages(); unsubTestimonials(); };
    }, []);

    // Genel Silme
    const handleDelete = async (collectionName: string, id: string) => {
        if (window.confirm("Bu öğeyi kalıcı olarak silmek istediğinize emin misiniz?")) {
            try { await deleteDoc(doc(db, collectionName, id)); }
            catch (error) { alert("Hata oluştu."); }
        }
    };

    // --- YENİ: CEVABI SİLME ---
    const handleDeleteReply = async (id: string) => {
        if (window.confirm("Sadece cevabınızı silmek istediğinize emin misiniz?")) {
            try {
                const testimonialRef = doc(db, "testimonials", id);
                // deleteField() o alanı veritabanından tamamen kaldırır
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

    // --- YENİ: DÜZENLEME MODUNU AÇMA ---
    const handleEditReply = (t: Testimonial) => {
        setReplyingTo(t.id);
        setReplyText(t.reply || ''); // Mevcut cevabı kutuya doldur
    };

    const handleReplySubmit = async (id: string) => {
        if (!replyText.trim()) return;
        try {
            await updateDoc(doc(db, "testimonials", id), { reply: replyText, replyDate: Timestamp.now() });
            setReplyText(''); setReplyingTo(null); alert("Cevap güncellendi!");
        } catch (error) { alert("Hata oluştu."); }
    };

    const handleBlogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onAddPost({ title: blogTitle, excerpt: blogExcerpt, content: blogContent, imageUrl: blogImage || undefined });
            setBlogTitle(''); setBlogExcerpt(''); setBlogContent(''); setBlogImage('');
        } catch (e) { console.error(e); }
        finally { setIsSubmitting(false); }
    };

    const handleRecipeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const ingredientsArray = recIngredients.split('\n').filter(line => line.trim() !== '');
            await onAddRecipe({
                title: recTitle, category: recCategory, calories: Number(recCalories) || 0,
                image: recImage || '', ingredients: ingredientsArray, preparation: recPreparation
            });
            setRecTitle(''); setRecCalories(''); setRecImage(''); setRecIngredients(''); setRecPreparation('');
            alert("Tarif eklendi!");
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
                    <button className={activeTab === 'testimonials' ? 'active' : ''} onClick={() => setActiveTab('testimonials')}>💬 Yorumlar</button>
                    <button className={activeTab === 'blog' ? 'active' : ''} onClick={() => setActiveTab('blog')}>✍️ Blog</button>
                    <button className={activeTab === 'recipes' ? 'active' : ''} onClick={() => setActiveTab('recipes')}>🥗 Tarifler</button>
                </div>
            </div>

            <div className="admin-content">

                {/* MESAJLAR */}
                {activeTab === 'messages' && (
                    <div className="messages-list">
                        {messages.length === 0 ? <p className="empty-msg">Gelen kutusu boş.</p> : messages.map(msg => (
                            <div key={msg.id} className="admin-card">
                                <div className="card-header"><strong>{msg.name}</strong> <span className="email">{msg.email}</span></div>
                                <p className="message-body">{msg.message}</p>
                                <div className="card-footer"><small>{formatDate(msg.createdAt)}</small><button className="delete-btn" onClick={() => handleDelete('messages', msg.id)}>Sil</button></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* YORUMLAR (GÜNCELLENDİ) */}
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
                                    {/* Cevap yoksa veya düzenleme modundaysak */}
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
                            <h3>Yeni Yazı</h3>
                            <form onSubmit={handleBlogSubmit} className="mini-form">
                                <input type="text" placeholder="Başlık" value={blogTitle} onChange={e => setBlogTitle(e.target.value)} required />
                                <input type="text" placeholder="Özet" value={blogExcerpt} onChange={e => setBlogExcerpt(e.target.value)} required />
                                <textarea placeholder="İçerik..." rows={6} value={blogContent} onChange={e => setBlogContent(e.target.value)} required></textarea>
                                <input type="url" placeholder="Görsel URL" value={blogImage} onChange={e => setBlogImage(e.target.value)} />
                                <button type="submit" disabled={isSubmitting}>{isSubmitting ? '...' : 'Yayınla'}</button>
                            </form>
                        </div>
                        <div className="existing-blogs">
                            <h3>Yazılar ({blogPosts.length})</h3>
                            {blogPosts.map(post => (
                                <div key={post.id} className="admin-card blog-mini-card">
                                    <span>{post.title}</span>
                                    <button className="delete-btn" onClick={() => handleDelete('blog-posts', post.id)}>Sil</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TARİF YÖNETİMİ */}
                {activeTab === 'recipes' && (
                    <div className="blog-management">
                        <div className="add-blog-container">
                            <h3>Yeni Tarif</h3>
                            <form onSubmit={handleRecipeSubmit} className="mini-form">
                                <input type="text" placeholder="Tarif Adı" value={recTitle} onChange={e => setRecTitle(e.target.value)} required />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select value={recCategory} onChange={e => setRecCategory(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                                        <option value="Tatlı">Tatlı</option>
                                        <option value="İçecek">İçecek</option>
                                        <option value="Salata">Salata</option>
                                        <option value="Ana Yemek">Ana Yemek</option>
                                        <option value="Atıştırmalık">Atıştırmalık</option>
                                    </select>
                                    <input type="number" placeholder="Kalori" value={recCalories} onChange={e => setRecCalories(e.target.value)} style={{ flex: 1 }} />
                                </div>
                                <textarea placeholder="Malzemeler (Her satıra bir tane)" rows={5} value={recIngredients} onChange={e => setRecIngredients(e.target.value)} required></textarea>
                                <textarea placeholder="Hazırlanışı" rows={5} value={recPreparation} onChange={e => setRecPreparation(e.target.value)} required></textarea>
                                <input type="url" placeholder="Fotoğraf URL" value={recImage} onChange={e => setRecImage(e.target.value)} />
                                <button type="submit" disabled={isSubmitting}>{isSubmitting ? '...' : 'Ekle'}</button>
                            </form>
                        </div>
                        <div className="existing-blogs">
                            <h3>Tarifler ({recipes.length})</h3>
                            {recipes.map(rec => (
                                <div key={rec.id} className="admin-card blog-mini-card">
                                    <div><strong>{rec.title}</strong><div style={{ fontSize: '12px', color: '#7ab800' }}>{rec.category}</div></div>
                                    <button className="delete-btn" onClick={() => handleDelete('recipes', rec.id)}>Sil</button>
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