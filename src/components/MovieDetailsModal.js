import React, { useEffect, useState } from 'react';
import { FaTimes, FaStar, FaCalendarAlt, FaClock, FaUsers, FaGlobe, FaTheaterMasks, FaImage } from 'react-icons/fa';
import './MovieDetailsModal.css';

function MovieDetailsModal({ imdbID, onClose }) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posterError, setPosterError] = useState(false);

  // Function to check if an image URL is valid (returns 200 OK)
  const isImageValid = async (url) => {
    if (!url || url === 'N/A') return false;
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error("Error validating image:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=a2bc5221&plot=full`);
        const data = await response.json();
        
        // Validate the poster image URL before displaying
        if (data.Poster && data.Poster !== 'N/A') {
          const isValid = await isImageValid(data.Poster);
          if (!isValid) {
            setPosterError(true);
            console.log(`Invalid poster image for ${data.Title}: ${data.Poster}`);
          }
        } else {
          setPosterError(true);
        }
        
        setMovieDetails(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [imdbID]);

  // Close modal when pressing ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (loading) {
    return (
      <div className="modal">
        <div className="modal-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!movieDetails) return null;

  // Create array of genre tags
  const genres = movieDetails.Genre ? movieDetails.Genre.split(', ') : [];

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>
          <FaTimes />
        </span>
        
        <div className="modal-content-wrapper">
          <div className="modal-poster">
            {!posterError && movieDetails.Poster && movieDetails.Poster !== 'N/A' ? (
              <img 
                src={movieDetails.Poster} 
                alt={movieDetails.Title} 
                onError={() => {
                  console.log(`Failed to load image: ${movieDetails.Poster}`);
                  setPosterError(true);
                }}
                loading="eager"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="poster-fallback">
                <FaImage />
                <p>{movieDetails.Title}</p>
              </div>
            )}
          </div>
          
          <div className="modal-info">
            <h2>{movieDetails.Title}</h2>
            
            <div className="movie-meta">
              {movieDetails.Year && <span><FaCalendarAlt /> {movieDetails.Year}</span>}
              {movieDetails.Runtime && <span><FaClock /> {movieDetails.Runtime}</span>}
              {movieDetails.Rated && <span><FaUsers /> {movieDetails.Rated}</span>}
            </div>
            
            <div className="genre-tags">
              {genres.map((genre, index) => (
                <span key={index} className="tag">{genre}</span>
              ))}
            </div>
            
            {movieDetails.Ratings && movieDetails.Ratings.length > 0 && (
              <div className="modal-ratings">
                {movieDetails.Ratings.map((rating, index) => (
                  <div key={index} className="rating-item">
                    <div className="rating-source">{rating.Source}</div>
                    <div className="rating-value">
                      <FaStar style={{ color: '#FFC107' }} /> {rating.Value}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {movieDetails.Plot && (
              <div className="movie-plot">
                <h3>Plot</h3>
                <p>{movieDetails.Plot}</p>
              </div>
            )}
            
            <div className="movie-details-grid">
              {movieDetails.Director && movieDetails.Director !== 'N/A' && (
                <div className="detail-item">
                  <h4><FaTheaterMasks /> Director</h4>
                  <p>{movieDetails.Director}</p>
                </div>
              )}
              
              {movieDetails.Writer && movieDetails.Writer !== 'N/A' && (
                <div className="detail-item">
                  <h4>Writer</h4>
                  <p>{movieDetails.Writer}</p>
                </div>
              )}
              
              {movieDetails.Actors && movieDetails.Actors !== 'N/A' && (
                <div className="detail-item">
                  <h4>Actors</h4>
                  <p>{movieDetails.Actors}</p>
                </div>
              )}
              
              {movieDetails.Language && movieDetails.Language !== 'N/A' && (
                <div className="detail-item">
                  <h4><FaGlobe /> Language</h4>
                  <p>{movieDetails.Language}</p>
                </div>
              )}
              
              {movieDetails.Country && movieDetails.Country !== 'N/A' && (
                <div className="detail-item">
                  <h4>Country</h4>
                  <p>{movieDetails.Country}</p>
                </div>
              )}
              
              {movieDetails.Awards && movieDetails.Awards !== 'N/A' && (
                <div className="detail-item">
                  <h4>Awards</h4>
                  <p>{movieDetails.Awards}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsModal;
