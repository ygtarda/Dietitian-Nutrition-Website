// src/components/BlogCard.tsx

import React from 'react';
import './BlogCard.css';
import type { BlogPost } from '../App';

interface BlogCardProps {
    post: BlogPost;
    onReadMore: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onReadMore }) => {
    return (
        <div
            className="blog-card"
            onClick={() => {
                console.log("Karta tıklandı:", post.title); // Tıklama kontrolü
                onReadMore();
            }}
        >
            <div className="card-image-placeholder">
                {/* Görsel varsa göster, yoksa placeholder koy */}
                <img
                    src={post.imageUrl || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400"}
                    alt={post.title}
                    className="blog-card-img"
                    onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400x250?text=Blog+Yazisi";
                    }}
                />
                <div className="blog-overlay">
                    <span>Oku</span>
                </div>
            </div>

            <div className="card-content">
                <span className="blog-date">{post.date}</span>
                <h4>{post.title}</h4>
                <p className="card-excerpt">
                    {post.excerpt.length > 100 ? post.excerpt.substring(0, 100) + "..." : post.excerpt}
                </p>

                {/* Butona tıklayınca da açılmasını garantiye alıyoruz */}
                <button className="read-more-button" onClick={(e) => {
                    e.stopPropagation(); // Kartın tıklamasını engelle, çift tetiklenmesin
                    console.log("Butona tıklandı");
                    onReadMore();
                }}>
                    Devamını Oku <span className="arrow">→</span>
                </button>
            </div>
        </div>
    );
};

export default BlogCard;