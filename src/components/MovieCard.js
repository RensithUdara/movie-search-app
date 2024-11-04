import React from 'react';
import './MovieCard.css';

function MovieCard({ movie, onSelect, onAddToFavorites, onRemoveFromFavorites, isFavorite }) {
  return (
    <div className="movie-card" onClick={onSelect}>
      <img src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'} alt={movie.Title} />
      <div className="movie-details">
        <h3>{movie.Title}</h3>
        <p>Year: {movie.Year}</p>
        <p>Type: {movie.Type}</p>
        {!isFavorite ? (
          <button onClick={(e) => { e.stopPropagation(); onAddToFavorites(); }}>Add to Favorites</button>
        ) : (
          <button onClick={(e) => { e.stopPropagation(); onRemoveFromFavorites(); }}>Remove from Favorites</button>
        )}
      </div>
    </div>
  );
}

export default MovieCard;
