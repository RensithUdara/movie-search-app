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

  const handleSearch = async () => {
    if (searchTerm.trim() === '') return;
    setLoading(true);
    try {
      const response = await fetch(`http://www.omdbapi.com/?s=${searchTerm}&page=${page}&apikey=a2bc5221`);
      const data = await response.json();
      if (data.Search) {
        setMovies(data.Search);
        setSearchHistory((prev) => [...new Set([searchTerm, ...prev])]);
      } else {
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
        <h1><FaFilm /> Movie Search App</h1>
        <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a movie..."
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
        <button onClick={handleSearch}>
          <FaSearch /> Search
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
                <p>No movies found matching "{searchTerm}"</p>
                <p>Try a different search term</p>
              </div>
            ) : (
              <div className="welcome-message">
                <p>Search for movies above to get started!</p>
              </div>
            )
          )}
        </div>
      )}

      <div className="pagination">
        <button onClick={() => handlePagination('prev')} disabled={page === 1}>
          <FaChevronLeft /> Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => handlePagination('next')}>
          Next <FaChevronRight />
        </button>
      </div>

      <section className="favorites-section">
        <h2><FaHeart /> Favorites</h2>
        <button className="clear-favorites" onClick={handleClearFavorites}>
          <FaTrash /> Clear All Favorites
        </button>
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
            <p>No favorites added yet. Click "Add to Favorites" on any movie card to add it here.</p>
          )}
        </div>
      </section>

      <section className="history-section">
        <h2><FaHistory /> Search History</h2>
        <div className="search-history">
          {searchHistory.length > 0 ? (
            searchHistory.map((term, index) => (
              <button key={index} onClick={() => {
                setSearchTerm(term);
                // Need to use a timeout to ensure setSearchTerm completes first
                setTimeout(() => handleSearch(), 0);
              }}>
                {term}
              </button>
            ))
          ) : (
            <p>Search for movies to build your history.</p>
          )}
        </div>
      </section>

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
