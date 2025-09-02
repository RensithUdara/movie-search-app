import React from 'react';
import { FaHeart, FaRegHeart, FaCalendarAlt, FaFilm, FaInfoCircle } from 'react-icons/fa';
import './MovieCard.css';

function MovieCard({ movie, onSelect, onAddToFavorites, onRemoveFromFavorites, isFavorite }) {
  return (
    <div className="movie-card">
      <div className="poster-container">
        <img 
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image+Available'} 
          alt={movie.Title} 
        />
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
