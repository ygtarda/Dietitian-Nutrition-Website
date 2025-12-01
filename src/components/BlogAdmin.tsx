// src/components/BlogAdmin.tsx

import React, { useState } from 'react';
import './BlogAdmin.css';
// .tsx uzantısını import ederken özellikle belirtiyoruz ki hata çıkmasın
// .tsx uzantısını import ederken özellikle belirtiyoruz ki hata çıkmasın
import type { BlogPost } from '../App.tsx';

interface BlogAdminProps {
    // Promise döndüren (async) bir fonksiyon bekliyoruz.
    // Çünkü veritabanına kayıt işlemi zaman alır.
    onAddPost: (newPost: Omit<BlogPost, 'id' | 'date'>) => Promise<void>;
}

const BlogAdmin: React.FC<BlogAdminProps> = ({ onAddPost }) => {
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    // Yükleniyor durumu (Butonu kilitlemek için)
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basit doğrulama
        if (!title || !excerpt || !content) {
            alert('Lütfen başlık, kısa açıklama ve içerik alanlarını doldurun.');
            return;
        }

        setIsSubmitting(true); // Yükleniyor başlat (Buton pasif olur)

        try {
            // App.tsx'ten gelen Firebase fonksiyonunu çağır ve bitmesini bekle
            await onAddPost({
                title,
                excerpt,
                content,
                imageUrl: imageUrl || undefined,
            });

            // İşlem başarılıysa formu temizle
            setTitle('');
            setExcerpt('');
            setContent('');
            setImageUrl('');

            // Başarı mesajı App.tsx içindeki fonksiyonda veriliyor zaten.

        } catch (error) {
            console.error("Hata:", error);
            alert("Bir sorun oluştu.");
        } finally {
            setIsSubmitting(false); // Yükleniyor durumunu kapat
        }
    };

    return (
        <section className="admin-section">
            <div className="admin-container">
                <h2>✍️ Blog Yönetim Paneli</h2>
                <p>Yeni bir yazı paylaşarak danışanlarınızı bilgilendirin.</p>

                <form onSubmit={handleSubmit} className="admin-form">

                    <div className="form-group">
                        <label htmlFor="title">Başlık:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Örn: Sağlıklı Atıştırmalıklar"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="excerpt">Kısa Açıklama (Kartta Görünecek):</label>
                        <textarea
                            id="excerpt"
                            rows={2}
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Yazının kısa bir özeti..."
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Tam İçerik:</label>
                        <textarea
                            id="content"
                            rows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Detaylı blog yazınızı buraya yazın..."
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageUrl">Görsel URL (Opsiyonel):</label>
                        <input
                            type="url"
                            id="imageUrl"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://ornek-resim.com/foto.jpg"
                        />
                    </div>

                    <button
                        type="submit"
                        className="admin-submit-button"
                        disabled={isSubmitting} // Gönderilirken butonu kilitle
                        style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'wait' : 'pointer' }}
                    >
                        {isSubmitting ? "Yayınlanıyor..." : "Yazıyı Yayınla"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default BlogAdmin;