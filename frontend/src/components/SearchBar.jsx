import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { productAPI } from '../utils/api';
import { getImageURL } from '../utils/helpers';

const SearchBar = ({ isVisible, onClose, onProductClick }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  const popularSearches = ['Maggi', 'Milk', 'Chips', 'Eggs', 'Bread', 'Medicine', 'Cold Drinks'];

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (query.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const { data } = await productAPI.getSuggestions(query);
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search error:', error);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  const handlePopularClick = (term) => {
    setQuery(term);
  };

  if (!isVisible) return null;

  return (
    <div className="search-section">
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search 'Grocery', 'Maggi', 'Milk'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          {query && (
            <button 
              onClick={() => { setQuery(''); setSuggestions([]); }}
              style={{ background:'none', border:'none', cursor:'pointer', padding: '8px', color: 'var(--text-light)' }}
            >
              <FiX size={16} />
            </button>
          )}
          <button className="search-btn">
            <FiSearch size={18} />
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map(product => (
              <div
                key={product._id}
                className="search-suggestion-item"
                onClick={() => {
                  onProductClick(product);
                  setShowSuggestions(false);
                  setQuery('');
                }}
              >
                <div className="suggestion-img" style={{ 
                  background: '#f8f8f8',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {product.image ? 
                    <img src={getImageURL(product.image)} alt="" style={{width:'100%', height:'100%', objectFit:'contain'}} /> 
                    : '📦'
                  }
                </div>
                <div className="suggestion-info">
                  <div className="suggestion-name">{product.name}</div>
                  <div className="suggestion-category">{product.category?.name}</div>
                </div>
                <div className="suggestion-price">
                  ₹{product.variants?.[0]?.price}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="popular-searches">
        <span className="popular-search-label">🔥 Popular:</span>
        {popularSearches.map(term => (
          <span
            key={term}
            className="popular-search-tag"
            onClick={() => handlePopularClick(term)}
          >
            {term}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;