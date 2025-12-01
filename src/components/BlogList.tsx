// src/components/BlogList.tsx

import React, { useState, useEffect } from 'react';
import './BlogList.css';
import BlogCard from './BlogCard';
import type { BlogPost } from '../App';

interface BlogListProps {
    posts: BlogPost[];
}

const POSTS_PER_PAGE = 3; // Tariflerle aynı olsun (3)

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    // Scroll Kilitleme
    useEffect(() => {
        if (selectedPost) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedPost]);

    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const currentPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

    const goToPage = (page: number) => setCurrentPage(page);

    return (
        <section id="blog" className="blog-list-section">
            <div className="blog-header">
                <h2>Blog Yazıları</h2>
                <p>Sağlıklı yaşam hakkında güncel bilgiler ve ipuçları.</p>
            </div>

            <div className="blog-grid">
                {currentPosts.map(post => (
                    <BlogCard
                        key={post.id}
                        post={{
                            ...post,
                            imageUrl: post.imageUrl || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop"
                        }}
                        onReadMore={() => setSelectedPost(post)}
                    />
                ))}
            </div>

            {/* Sayfalandırma (Tariflerle Birebir Aynı Tasarım) */}
            {totalPages > 1 && (
                <div className="blog-pagination">
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="page-btn">&lt; Önceki</button>
                    <span className="page-info">{currentPage} / {totalPages}</span>
                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="page-btn">Sonraki &gt;</button>
                </div>
            )}

            {posts.length === 0 && <p className="no-posts-message">Henüz blog yazısı eklenmemiş.</p>}

            {/* --- PREMIUM MODAL (TARİFLER İLE AYNI YAPI) --- */}
            {selectedPost && (
                <div className="blog-modal-overlay" onClick={() => setSelectedPost(null)}>
                    <div className="blog-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedPost(null)}>&times;</button>

                        {/* Resim En Üstte */}
                        <div className="blog-modal-image">
                            <img
                                src={selectedPost.imageUrl || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop"}
                                alt={selectedPost.title}
                            />
                        </div>

                        {/* İçerik Resmin Altına (ve üstüne binerek) Geliyor */}
                        <div className="blog-modal-content">
                            <span className="blog-modal-date">{selectedPost.date}</span>
                            <h2>{selectedPost.title}</h2>
                            <div className="blog-text">
                                <p>{selectedPost.content}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
};

export default BlogList;