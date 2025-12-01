// src/components/Testimonials.tsx

import React, { useState, useEffect } from 'react';
import './Testimonials.css';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';

interface Testimonial {
    id: string;
    name: string;
    comment: string;
    rating: number;
    date?: any;
    reply?: string;
}

const Testimonials: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [newName, setNewName] = useState('');
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // --- YENİ: SIRALAMA STATE'İ ---
    // Varsayılan olarak 'newest' (En Yeniler) seçili
    const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

    const [currentPage, setCurrentPage] = useState(1);
    const COMMENTS_PER_PAGE = 3;

    // Verileri Çekme
    useEffect(() => {
        // Veriyi ham haliyle çekiyoruz, sıralamayı aşağıda JavaScript ile yapacağız
        const q = query(collection(db, "testimonials"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Testimonial[];
            setTestimonials(fetchedData);
        });
        return () => unsubscribe();
    }, []);

    // --- SIRALAMA MANTIĞI (Trendyol Tarzı) ---
    const getSortedTestimonials = () => {
        // Orijinal diziyi bozmamak için kopyasını alıyoruz ([...testimonials])
        const sorted = [...testimonials];

        switch (sortOption) {
            case 'newest':
                // Tarihe göre azalan (En yeni en üstte)
                return sorted.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0));
            case 'oldest':
                // Tarihe göre artan
                return sorted.sort((a, b) => (a.date?.seconds || 0) - (b.date?.seconds || 0));
            case 'highest':
                // Puana göre azalan (5'ten 1'e)
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'lowest':
                // Puana göre artan (1'den 5'e)
                return sorted.sort((a, b) => a.rating - b.rating);
            default:
                return sorted;
        }
    };

    const sortedTestimonials = getSortedTestimonials();

    // Sayfalandırma (Sıralanmış liste üzerinden hesaplanıyor)
    const indexOfLastComment = currentPage * COMMENTS_PER_PAGE;
    const indexOfFirstComment = indexOfLastComment - COMMENTS_PER_PAGE;
    const currentComments = sortedTestimonials.slice(indexOfFirstComment, indexOfLastComment);
    const totalPages = Math.ceil(sortedTestimonials.length / COMMENTS_PER_PAGE);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Yorum Ekleme
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || !newComment.trim()) return alert("Lütfen alanları doldurun.");

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "testimonials"), {
                name: newName,
                comment: newComment,
                rating: Number(newRating),
                date: Timestamp.now()
            });
            setNewName(''); setNewComment(''); setNewRating(5); setShowForm(false); setCurrentPage(1);
            alert("Yorumunuz eklendi!");
        } catch (error) { console.error(error); alert("Hata oluştu."); }
        finally { setIsSubmitting(false); }
    };

    const renderStars = (rating: number) => {
        const fullStars = '★'.repeat(rating);
        const emptyStars = '☆'.repeat(5 - rating);
        return <span className="stars">{fullStars}{emptyStars}</span>;
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        return new Date(timestamp.seconds * 1000).toLocaleDateString('tr-TR');
    };

    // İsim Baş Harfleri
    const getInitials = (name: string) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <section id="yorumlar" className="testimonials-section">
            <div className="testimonials-header">
                <h2>Danışan Deneyimleri</h2>
                <p>Danışanlarımızın başarı hikayeleri ve değerlendirmeleri.</p>

                <button className="add-review-btn" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "✕ Vazgeç" : "✍️ Siz de Yorum Yapın"}
                </button>
            </div>

            {showForm && (
                <div className="form-container">
                    <form onSubmit={handleSubmit} className="testimonial-form">
                        <h3>Deneyiminizi Paylaşın</h3>
                        <div className="form-row">
                            <div className="input-group">
                                <input type="text" placeholder="Adınız Soyadınız" value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={30} required />
                            </div>
                            <div className="input-group rating-group">
                                <label>Puanınız:</label>
                                <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
                                    <option value="5">5 Yıldız - Mükemmel</option>
                                    <option value="4">4 Yıldız - Çok İyi</option>
                                    <option value="3">3 Yıldız - İyi</option>
                                    <option value="2">2 Yıldız - Orta</option>
                                    <option value="1">1 Yıldız - Geliştirilmeli</option>
                                </select>
                            </div>
                        </div>
                        <textarea placeholder="Diyet süreciniz nasıldı? Görüşleriniz bizim için değerli..." value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={4} maxLength={300} required></textarea>
                        <button type="submit" className="submit-comment-btn" disabled={isSubmitting}>{isSubmitting ? "Gönderiliyor..." : "Yorumu Yayınla"}</button>
                    </form>
                </div>
            )}

            {/* --- SIRALAMA FİLTRELERİ (YENİ) --- */}
            <div className="sort-container">
                <span className="sort-label">Sırala:</span>
                <button className={`sort-btn ${sortOption === 'newest' ? 'active' : ''}`} onClick={() => setSortOption('newest')}>En Yeniler</button>
                <button className={`sort-btn ${sortOption === 'highest' ? 'active' : ''}`} onClick={() => setSortOption('highest')}>En Yüksek Puan</button>
                <button className={`sort-btn ${sortOption === 'lowest' ? 'active' : ''}`} onClick={() => setSortOption('lowest')}>En Düşük Puan</button>
            </div>

            <div className="reviews-container">
                {currentComments.length === 0 ? <p className="no-comments">Henüz yorum yapılmamış.</p> : currentComments.map((t) => (
                    <div key={t.id} className="review-card">
                        <div className="review-header">
                            <div className="avatar-circle">{getInitials(t.name)}</div>
                            <div className="user-meta">
                                <h4>{t.name}</h4>
                                <div className="meta-sub">
                                    {renderStars(t.rating)}
                                    <span className="dot">•</span>
                                    <span className="review-date">{formatDate(t.date)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="review-body">
                            <p>{t.comment}</p>
                        </div>

                        {t.reply && (
                            <div className="owner-response">
                                <div className="response-header">
                                    <span className="response-label">Diyetisyen Yanıtı</span>
                                </div>
                                <p>{t.reply}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="page-btn">&lt; Önceki</button>
                    <span className="page-info">{currentPage} / {totalPages}</span>
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="page-btn">Sonraki &gt;</button>
                </div>
            )}
        </section>
    );
};

export default Testimonials;