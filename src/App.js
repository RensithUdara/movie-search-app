import React, { useState, useEffect } from 'react';
import MovieCard from './components/MovieCard';
import MovieDetailsModal from './components/MovieDetailsModal';
import './App.css';
import { 
  FaSearch, 
  FaSun, 
  FaMoon, 
  FaTimes, 
  FaHeart, 
  FaHistory, 
  FaChevronLeft, 
  FaChevronRight,
  FaTrash,
  FaFilm
} from 'react-icons/fa';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);
  
  // Effect to run search when page changes
  useEffect(() => {
    if (searchTerm.trim() !== '') {
      handleSearch();
    }
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async () => {
    if (searchTerm.trim() === '') return;
    setLoading(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&page=${page}&apikey=a2bc5221`);
      const data = await response.json();
      if (data.Search) {
        // Process the movies data
        const processedMovies = data.Search.map(movie => {
          // Check if poster URL is valid (not N/A)
          if (movie.Poster === 'N/A') {
            console.log(`Movie with missing poster: ${movie.Title} (${movie.imdbID})`);
          }
          return movie;
        });
        
        setMovies(processedMovies);
        setSearchHistory((prev) => [...new Set([searchTerm, ...prev.slice(0, 9)])]);
      } else {
        console.log('No movies found for search term:', searchTerm);
        setMovies([]);
      }
    } catch (error) {
      console.error('Error fetching movie data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setMovies([]);
    setPage(1);
  };

  const handleAddToFavorites = (movie) => {
    if (!favorites.some((fav) => fav.imdbID === movie.imdbID)) {
      setFavorites([...favorites, movie]);
    }
  };

  const handleRemoveFromFavorites = (imdbID) => {
    setFavorites(favorites.filter((fav) => fav.imdbID !== imdbID));
  };

  const handleClearFavorites = () => {
    setFavorites([]);
  };

  const handlePagination = (direction) => {
    setPage((prev) => (direction === 'next' ? prev + 1 : Math.max(prev - 1, 1)));
  };

  return (
    <div className="app-frame">
      <header className="app-header">
        <div className="logo">
          <FaFilm className="logo-icon" />
          <h1>MovieFlix</h1>
        </div>
        <div className="header-actions">
          <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />} 
            <span className="button-text">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </header>
      
      {!movies.length && !searchTerm.trim() && (
        <div className="hero-section">
          <h2>Discover Your Next Favorite Movie</h2>
          <p>Search from thousands of titles, explore details, and build your collection</p>
        </div>
      )}
      
      <div className="search-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for movies by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          {searchTerm && (
            <button className="clear-search" onClick={handleClearSearch}>
              <FaTimes />
            </button>
          )}
        </div>
        <button className="search-button" onClick={handleSearch}>
          <FaSearch /> <span className="button-text">Search</span>
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading movies...</div>
      ) : (
        <div className="movies-container">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                onSelect={() => setSelectedMovie(movie.imdbID)}
                onAddToFavorites={() => handleAddToFavorites(movie)}
              />
            ))
          ) : (
            searchTerm.trim() !== '' ? (
              <div className="no-results">
                <div className="message-icon">
                  <FaSearch className="search-empty-icon" />
                </div>
                <h3>No movies found matching "{searchTerm}"</h3>
                <p>Try different keywords or check for spelling errors</p>
                <button className="try-again-button" onClick={() => setSearchTerm('')}>
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="welcome-message">
                <div className="welcome-icon">
                  <FaFilm className="film-icon" />
                </div>
                <h3>Ready to explore movies?</h3>
                <p>Start by searching for a title above</p>
              </div>
            )
          )}
        </div>
      )}

      {movies.length > 0 && (
        <div className="pagination">
          <button 
            className="pagination-button prev" 
            onClick={() => handlePagination('prev')} 
            disabled={page === 1}
          >
            <FaChevronLeft /> <span className="button-text">Previous</span>
          </button>
          <div className="page-indicator">
            <span>Page {page}</span>
          </div>
          <button 
            className="pagination-button next" 
            onClick={() => handlePagination('next')}
          >
            <span className="button-text">Next</span> <FaChevronRight />
          </button>
        </div>
      )}

      <div className="sections-container">
        <section className="favorites-section">
          <div className="section-header">
            <div className="section-title">
              <FaHeart className="section-icon heart" /> 
              <h2>My Favorites</h2>
            </div>
            {favorites.length > 0 && (
              <button className="clear-favorites" onClick={handleClearFavorites}>
                <FaTrash /> <span className="button-text">Clear All</span>
              </button>
            )}
          </div>
          
          <div className="favorites-container">
            {favorites.length > 0 ? (
              favorites.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  onSelect={() => setSelectedMovie(movie.imdbID)}
                  onRemoveFromFavorites={() => handleRemoveFromFavorites(movie.imdbID)}
                  isFavorite
                />
              ))
            ) : (
              <div className="empty-section">
                <div className="empty-icon">
                  <FaHeart className="heart-icon" />
                </div>
                <h3>No favorites yet</h3>
                <p>Add movies you love to your favorites collection</p>
              </div>
            )}
          </div>
        </section>

        <section className="history-section">
          <div className="section-header">
            <div className="section-title">
              <FaHistory className="section-icon history" /> 
              <h2>Recent Searches</h2>
            </div>
            {searchHistory.length > 0 && (
              <button className="clear-history" onClick={() => setSearchHistory([])}>
                <FaTrash /> <span className="button-text">Clear</span>
              </button>
            )}
          </div>
          
          <div className="search-history">
            {searchHistory.length > 0 ? (
              <div className="history-chips">
                {searchHistory.map((term, index) => (
                  <button 
                    key={index} 
                    className="history-chip"
                    onClick={() => {
                      setSearchTerm(term);
                      // Need to use a timeout to ensure setSearchTerm completes first
                      setTimeout(() => handleSearch(), 0);
                    }}
                  >
                    <FaSearch className="tiny-search" /> {term}
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-section">
                <div className="empty-icon">
                  <FaHistory className="history-icon" />
                </div>
                <h3>No search history</h3>
                <p>Your recent searches will appear here</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {selectedMovie && (
        <MovieDetailsModal
          imdbID={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default App;
