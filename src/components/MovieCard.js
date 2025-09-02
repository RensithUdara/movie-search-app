import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaCalendarAlt, FaFilm, FaInfoCircle, FaImage } from 'react-icons/fa';
import './MovieCard.css';

function MovieCard({ movie, onSelect, onAddToFavorites, onRemoveFromFavorites, isFavorite }) {
  const [imageError, setImageError] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  
  // Validate image on component mount
  useEffect(() => {
    const validateImage = async () => {
      if (!movie.Poster || movie.Poster === 'N/A') {
        setImageError(true);
        setIsValidating(false);
        return;
      }

      try {
        const response = await fetch(movie.Poster, { method: 'HEAD' });
        if (!response.ok) {
          setImageError(true);
          console.log(`Invalid poster image for ${movie.Title}: ${movie.Poster}`);
        }
      } catch (error) {
        console.error(`Error validating image for ${movie.Title}:`, error);
        setImageError(true);
      } finally {
        setIsValidating(false);
      }
    };

    validateImage();
  }, [movie.Poster, movie.Title]);

  // Handle image load errors
  const handleImageError = () => {
    console.log(`Failed to load image: ${movie.Poster}`);
    setImageError(true);
  };

  return (
    <div className="movie-card">
      <div className="poster-container">
        {!imageError && movie.Poster && movie.Poster !== 'N/A' ? (
          <img 
            src={movie.Poster} 
            alt={movie.Title}
            onError={handleImageError}
            loading="eager"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="fallback-poster">
            <FaImage />
            <p>{movie.Title}</p>
          </div>
        )}
        <div className="movie-overlay">
          <button className="info-button" onClick={onSelect}>
            <FaInfoCircle /> View Details
          </button>
        </div>
      </div>
      <div className="movie-details">
        <h3 title={movie.Title}>{movie.Title}</h3>
        <div className="movie-metadata">
          <p><FaCalendarAlt /> {movie.Year}</p>
          <p><FaFilm /> {movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}</p>
        </div>
        {!isFavorite ? (
          <button 
            className="favorite-button" 
            onClick={(e) => { e.stopPropagation(); onAddToFavorites(); }}
          >
            <FaRegHeart /> Add to Favorites
          </button>
        ) : (
          <button 
            className="favorite-button remove" 
            onClick={(e) => { e.stopPropagation(); onRemoveFromFavorites(); }}
          >
            <FaHeart /> Remove from Favorites
          </button>
        )}
      </div>
    </div>
  );
}

export default MovieCard;
