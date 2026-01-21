// src/components/Testimonials.tsx

import React, { useState, useEffect } from 'react';
import './Testimonials.css';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, Timestamp } from 'firebase/firestore';

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
    const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

    // --- KARAKTER SINIRI AYARLARI ---
    const MAX_CHARS = 300; // Maksimum karakter sayısı
    const [charCount, setCharCount] = useState(0);
    const [showLimitWarning, setShowLimitWarning] = useState(false);

    // --- YENİ: FORM DURUM BİLDİRİMİ (ALERT YERİNE) ---
    // msgbox yerine formun içinde görünecek durum mesajı state'i
    const [formStatus, setFormStatus] = useState<{ msg: string; type: 'error' | 'success' } | null>(null);

    // Sayfalandırma
    const [currentPage, setCurrentPage] = useState(1);
    const COMMENTS_PER_PAGE = 3;

    useEffect(() => {
        // Sıralama işlemi istemci tarafında yapıldığı için basit query
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

    // Form açıldığında/kapandığında hata mesajını ve validasyonları temizle
    useEffect(() => {
        if (!showForm) {
            setFormStatus(null);
            setShowLimitWarning(false); // Form kapanınca uyarıyı da temizle
        }
    }, [showForm]);

    // --- YORUM DEĞİŞİKLİĞİ VE KARAKTER KONTROLÜ ---
    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;

        if (text.length <= MAX_CHARS) {
            setNewComment(text);
            setCharCount(text.length);
            setShowLimitWarning(false);
        } else {
            // Sınırı aşmaya çalışırsa uyarı ver
            setShowLimitWarning(true);
            // Fazla karakterleri kes (Kopyala-yapıştır durumunda garanti olsun)
            /* setNewComment(text.substring(0, MAX_CHARS)); */
            /* setCharCount(MAX_CHARS); */
            // Not: Genellikle input değeri state'e bağlıysa (controlled component), 
            // yukarıdaki if bloğuna girmediği için state güncellenmez ve yazı yazılmaz.
        }
    };

    const getSortedTestimonials = () => {
        const sorted = [...testimonials];
        switch (sortOption) {
            case 'newest': return sorted.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0));
            case 'oldest': return sorted.sort((a, b) => (a.date?.seconds || 0) - (b.date?.seconds || 0));
            case 'highest': return sorted.sort((a, b) => b.rating - a.rating);
            case 'lowest': return sorted.sort((a, b) => a.rating - b.rating);
            default: return sorted;
        }
    };

    const sortedTestimonials = getSortedTestimonials();
    const indexOfLastComment = currentPage * COMMENTS_PER_PAGE;
    const indexOfFirstComment = indexOfLastComment - COMMENTS_PER_PAGE;
    const currentComments = sortedTestimonials.slice(indexOfFirstComment, indexOfLastComment);
    const totalPages = Math.ceil(sortedTestimonials.length / COMMENTS_PER_PAGE);
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // VALIDASYON: Boş alan kontrolü (Alert kaldırıldı -> Inline hata)
        if (!newName.trim() || !newComment.trim()) {
            setFormStatus({ msg: "Lütfen tüm alanları doldurun.", type: 'error' });
            return;
        }

        setIsSubmitting(true);
        setFormStatus(null);

        try {
            await addDoc(collection(db, "testimonials"), {
                name: newName,
                comment: newComment,
                rating: Number(newRating),
                date: Timestamp.now()
            });

            // [SCROLL JUMP FIX]: Formu hemen kapatmıyoruz!
            // Formu açık tutuyoruz ve kullanıcıya başarı mesajı gösteriyoruz.
            // Bu sayede DOM yüksekliği değişmiyor ve SCROLL KAYMIYOR.
            setFormStatus({ msg: "Yorumunuz başarıyla yayınlandı! Form kapatılıyor...", type: 'success' });

            // 2 saniye bekleyip sonra temizlik ve kapanış yapıyoruz
            setTimeout(() => {
                setNewName('');
                setNewComment('');
                setCharCount(0);
                setNewRating(5);
                setShowLimitWarning(false); // Validasyon uyarısını temizle

                setShowForm(false); // Form şimdi kapanıyor
                setFormStatus(null);
                setIsSubmitting(false); // Buton kilidini aç
                setCurrentPage(1); // İlk sayfaya dön
            }, 2000);

        } catch (error) {
            console.error(error);
            // Hata durumunda hemen bildirim göster ve kilidi aç
            setFormStatus({ msg: "Bir hata oluştu. Lütfen tekrar deneyin.", type: 'error' });
            setIsSubmitting(false);
        }
        // finally bloğu kaldırıldı çünkü success durumunda timeout içinde yönetiyoruz.
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
                    {showForm ? "✕ Vazgeç" : "✍️ Yorum Yap"}
                </button>
            </div>

            {showForm && (
                <div className="form-container">
                    <form onSubmit={handleSubmit} className="testimonial-form">
                        <h3>Deneyiminizi Paylaşın</h3>

                        <div className="form-row">
                            <div className="input-group">
                                <label>Adınız Soyadınız</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    maxLength={30}
                                    required
                                    placeholder="Ad Soyad"
                                />
                            </div>
                            <div className="input-group rating-group">
                                <label>Puanınız</label>
                                <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
                                    <option value="5">★★★★★ (5 - Mükemmel)</option>
                                    <option value="4">★★★★☆ (4 - Çok İyi)</option>
                                    <option value="3">★★★☆☆ (3 - İyi)</option>
                                    <option value="2">★★☆☆☆ (2 - Orta)</option>
                                    <option value="1">★☆☆☆☆ (1 - Geliştirilmeli)</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Yorumunuz</label>
                            <textarea
                                value={newComment}
                                onChange={handleCommentChange}
                                rows={4}
                                required
                                placeholder="Süreciniz nasıldı? Görüşleriniz bizim için değerli..."
                            ></textarea>

                            {/* Karakter Sayacı */}
                            <div className={`char-counter ${charCount >= MAX_CHARS ? 'limit' : charCount > MAX_CHARS * 0.9 ? 'warning' : ''}`}>
                                {charCount} / {MAX_CHARS}
                            </div>

                            {/* Sınır Uyarısı */}
                            {showLimitWarning && (
                                <div className="limit-warning-msg">
                                    ⚠️ Maksimum karakter sınırına ulaştınız!
                                </div>
                            )}
                        </div>

                        {/* YENİ: FORM DURUM MESAJI (Alert yerine) */}
                        {formStatus && (
                            <div className={`form-status-msg ${formStatus.type}`}>
                                {formStatus.type === 'error' ? '⚠️ ' : '✅ '}
                                {formStatus.msg}
                            </div>
                        )}

                        <button type="submit" className="submit-comment-btn" disabled={isSubmitting}>
                            {isSubmitting ? "Gönderiliyor..." : "YORUMU YAYINLA"}
                        </button>
                    </form>
                </div>
            )}

            {/* SIRALAMA */}
            <div className="sort-container">
                <span className="sort-label">Sırala:</span>
                <button className={`sort-btn ${sortOption === 'newest' ? 'active' : ''}`} onClick={() => setSortOption('newest')}>En Yeniler</button>
                <button className={`sort-btn ${sortOption === 'highest' ? 'active' : ''}`} onClick={() => setSortOption('highest')}>En Yüksek Puan</button>
                <button className={`sort-btn ${sortOption === 'lowest' ? 'active' : ''}`} onClick={() => setSortOption('lowest')}>En Düşük Puan</button>
            </div>

            <div className="reviews-container">
                {currentComments.length === 0 ? <p style={{ gridColumn: '1/-1', color: '#999' }}>Henüz yorum yok.</p> : currentComments.map((t) => (
                    <div key={t.id} className="review-card">
                        <div className="review-header">
                            <div className="avatar-circle">{getInitials(t.name)}</div>
                            <div className="user-meta">
                                <h4>{t.name}</h4>
                                <div className="meta-sub">
                                    {renderStars(t.rating)}
                                    <span className="review-date">• {formatDate(t.date)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="review-body">
                            <p>{t.comment}</p>
                        </div>

                        {t.reply && (
                            <div className="owner-response">
                                <div className="response-header">
                                    <span className="response-label">Diyetisyen Gül Ödek</span>
                                </div>
                                <p>{t.reply}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Sayfalandırma Butonları */}
            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="page-btn"> &lt; </button>
                    <span className="page-info">{currentPage} / {totalPages}</span>
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="page-btn"> &gt; </button>
                </div>
            )}
        </section>
    );
};

export default Testimonials;