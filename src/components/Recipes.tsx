// src/components/Recipes.tsx

import React, { useState, useEffect } from 'react';
import './Recipes.css';
import type { Recipe } from '../App';

interface RecipesProps {
    recipes: Recipe[];
}

// SAYFA BAŞINA 3 TARİF (Tek Satır)
const RECIPES_PER_PAGE = 3;

const Recipes: React.FC<RecipesProps> = ({ recipes }) => {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('Tümü');

    // --- SAYFALANDIRMA STATE'LERİ ---
    const [currentPage, setCurrentPage] = useState(1);

    const categories = ['Tümü', 'Tatlı', 'İçecek', 'Salata', 'Ana Yemek', 'Atıştırmalık'];

    // Scroll Kilitleme
    useEffect(() => {
        if (selectedRecipe) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedRecipe]);

    // 1. Önce Filtreleme Yap
    const filteredRecipes = activeFilter === 'Tümü'
        ? recipes
        : recipes.filter(r => r.category === activeFilter);

    // 2. Filtrelenmiş Sonuçları Sayfalara Böl
    const indexOfLastRecipe = currentPage * RECIPES_PER_PAGE;
    const indexOfFirstRecipe = indexOfLastRecipe - RECIPES_PER_PAGE;
    const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
    const totalPages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);

    // Kategori değişince 1. sayfaya dön
    const handleFilterChange = (cat: string) => {
        setActiveFilter(cat);
        setCurrentPage(1);
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <section id="tarifler" className="recipes-section">
            <div className="section-header">
                <h2>Sağlıklı Tarifler</h2>
                <p>Lezzetten ödün vermeden formda kalmanın sırları.</p>
            </div>

            <div className="recipe-filters">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={activeFilter === cat ? 'active' : ''}
                        onClick={() => handleFilterChange(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="recipes-grid">
                {currentRecipes.length === 0 ? (
                    <p className="no-recipes-msg">Bu kategoride henüz tarif eklenmemiş.</p>
                ) : (
                    currentRecipes.map(recipe => (
                        <div key={recipe.id} className="recipe-card" onClick={() => setSelectedRecipe(recipe)}>
                            <div className="recipe-image">
                                <img
                                    src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"}
                                    alt={recipe.title}
                                    onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x300?text=Resim+Yok"; }}
                                />
                                <span className="calorie-badge">{recipe.calories} kcal</span>
                            </div>
                            <div className="recipe-info">
                                <span className="category-tag">{recipe.category}</span>
                                <h3>{recipe.title}</h3>
                                <button className="view-recipe-btn">Tarifi İncele →</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* --- SAYFALANDIRMA BUTONLARI --- */}
            {totalPages > 1 && (
                <div className="recipe-pagination">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="page-btn"
                    >
                        &lt; Önceki
                    </button>
                    <span className="page-info">{currentPage} / {totalPages}</span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="page-btn"
                    >
                        Sonraki &gt;
                    </button>
                </div>
            )}

            {selectedRecipe && (
                <div className="recipe-modal-overlay" onClick={() => setSelectedRecipe(null)}>
                    <div className="recipe-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setSelectedRecipe(null)}>&times;</button>

                        <div className="modal-image">
                            <img
                                src={selectedRecipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"}
                                alt={selectedRecipe.title}
                                onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/800x600?text=Resim+Yok"; }}
                            />
                        </div>

                        <div className="modal-content">
                            <span className="modal-category">{selectedRecipe.category} • {selectedRecipe.calories} kcal</span>
                            <h3>{selectedRecipe.title}</h3>

                            <div className="recipe-details">
                                <div className="ingredients">
                                    <h4>🛒 Malzemeler</h4>
                                    <ul>
                                        {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 ? (
                                            selectedRecipe.ingredients.map((ing, index) => (
                                                <li key={index}>{ing}</li>
                                            ))
                                        ) : (
                                            <li>Malzeme bilgisi girilmemiş.</li>
                                        )}
                                    </ul>
                                </div>

                                <div className="preparation">
                                    <h4>👩‍🍳 Hazırlanışı</h4>
                                    <p style={{ whiteSpace: 'pre-line' }}>{selectedRecipe.preparation}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Recipes;