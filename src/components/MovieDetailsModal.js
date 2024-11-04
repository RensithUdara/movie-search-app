import React, { useEffect, useState } from 'react';
import './MovieDetailsModal.css';

function MovieDetailsModal({ imdbID, onClose }) {
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const response = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=a2bc5221`);
      const data = await response.json();
      setMovieDetails(data);
    };

    fetchMovieDetails();
  }, [imdbID]);

  if (!movieDetails) return <div className="modal">Loading details...</div>;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>{movieDetails.Title}</h2>
        <p><strong>Year:</strong> {movieDetails.Year}</p>
        <p><strong>Genre:</strong> {movieDetails.Genre}</p>
        <p><strong>Plot:</strong> {movieDetails.Plot}</p>
        <p><strong>Director:</strong> {movieDetails.Director}</p>
        <img src={movieDetails.Poster} alt={movieDetails.Title} />
      </div>
    </div>
  );
}

export default MovieDetailsModal;
