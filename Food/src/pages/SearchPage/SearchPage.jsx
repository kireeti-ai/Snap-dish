import React, { useContext, useState, useEffect } from 'react';
import './SearchPage.css';
import { StoreContext } from '../../Context/StoreContext'; // Fixed import
import FoodItem from '../../components/FoodItem/FoodItem';
import RestaurantItem from "../../components/RestaurantItem/RestaurantItem";

const SearchPage = () => {
  const { food_list, restaurant_list } = useContext(StoreContext); // Fixed: using StoreContext

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    category: 'All',
    rating: 0,
    price: 'Any',
    sortBy: 'relevance',
    searchIn: 'All' // All, Foods, Restaurants
  });

  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    let results = [];

    // Decide dataset based on filter
    if (activeFilters.searchIn === "Foods" || activeFilters.searchIn === "All") {
      results.push(...food_list.map(item => ({ ...item, type: "food" })));
    }
    if (activeFilters.searchIn === "Restaurants" || activeFilters.searchIn === "All") {
      results.push(...restaurant_list.map(item => ({ ...item, type: "restaurant" })));
    }

    // Apply search
    if (searchQuery.trim()) {
      results = results.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(searchLower);
        const descMatch = item.description && item.description.toLowerCase().includes(searchLower);
        const cuisineMatch = item.cuisine && item.cuisine.toLowerCase().includes(searchLower);
        const categoryMatch = item.category && item.category.toLowerCase().includes(searchLower);
        
        return nameMatch || descMatch || cuisineMatch || categoryMatch;
      });
    }

    // Filters for foods only
    if (activeFilters.searchIn !== "Restaurants") {
      if (activeFilters.category !== 'All') {
        results = results.filter(item => {
          if (item.type === "restaurant") return true; // keep restaurants when filtering by category
          return item.category === activeFilters.category || 
                 (activeFilters.category === 'Veg' && item.is_veg) ||
                 (activeFilters.category === 'Non-Veg' && !item.is_veg);
        });
      }
      
      if (activeFilters.rating > 0) {
        results = results.filter(item => (item.rating || 0) >= activeFilters.rating);
      }
      
      if (activeFilters.price !== 'Any') {
        results = results.filter(item => {
          if (item.type !== "food") return true; // skip restaurants for price filter
          const price = item.price || 0;
          if (activeFilters.price === 'Under ₹200') return price < 200;
          if (activeFilters.price === '₹200-₹400') return price >= 200 && price <= 400;
          if (activeFilters.price === 'Over ₹400') return price > 400;
          return true;
        });
      }
    }

    // Sorting
    results.sort((a, b) => {
      switch (activeFilters.sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'price_asc':
          if (a.type === "restaurant" && b.type === "restaurant") {
            return (a.price_for_two || 0) - (b.price_for_two || 0);
          }
          return (a.price || 0) - (b.price || 0);
        case 'price_desc':
          if (a.type === "restaurant" && b.type === "restaurant") {
            return (b.price_for_two || 0) - (a.price_for_two || 0);
          }
          return (b.price || 0) - (a.price || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default: // relevance
          return 0;
      }
    });

    setFilteredResults(results);
  }, [searchQuery, activeFilters, food_list, restaurant_list]);

  const handleFilterChange = (filterName, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Get unique categories from food items
  const getCategories = () => {
    const categories = new Set(['All']);
    food_list.forEach(food => {
      if (food.category) categories.add(food.category);
    });
    categories.add('Veg');
    categories.add('Non-Veg');
    return Array.from(categories);
  };

  return (
    <div className="search-page">
      <aside className="filter-sidebar">
        <h3>Filters</h3>

        {/* Search In filter */}
        <div className="filter-group">
          <h4>Search In</h4>
          <label>
            <input 
              type="radio" 
              name="searchIn" 
              checked={activeFilters.searchIn === 'All'} 
              onChange={() => handleFilterChange('searchIn', 'All')} 
            /> 
            All
          </label>
          <label>
            <input 
              type="radio" 
              name="searchIn" 
              checked={activeFilters.searchIn === 'Foods'} 
              onChange={() => handleFilterChange('searchIn', 'Foods')} 
            /> 
            Foods
          </label>
          <label>
            <input 
              type="radio" 
              name="searchIn" 
              checked={activeFilters.searchIn === 'Restaurants'} 
              onChange={() => handleFilterChange('searchIn', 'Restaurants')} 
            /> 
            Restaurants
          </label>
        </div>

        {/* Keep food-only filters visible only if searching foods */}
        {activeFilters.searchIn !== "Restaurants" && (
          <>
            <div className="filter-group">
              <h4>Category</h4>
              {getCategories().map(category => (
                <label key={category}>
                  <input 
                    type="radio" 
                    name="category" 
                    checked={activeFilters.category === category} 
                    onChange={() => handleFilterChange('category', category)} 
                  /> 
                  {category}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h4>Rating</h4>
              <label>
                <input 
                  type="radio" 
                  name="rating" 
                  checked={activeFilters.rating === 4} 
                  onChange={() => handleFilterChange('rating', 4)} 
                /> 
                4 ★ & above
              </label>
              <label>
                <input 
                  type="radio" 
                  name="rating" 
                  checked={activeFilters.rating === 3} 
                  onChange={() => handleFilterChange('rating', 3)} 
                /> 
                3 ★ & above
              </label>
              <label>
                <input 
                  type="radio" 
                  name="rating" 
                  checked={activeFilters.rating === 0} 
                  onChange={() => handleFilterChange('rating', 0)} 
                /> 
                All Ratings
              </label>
            </div>
            
            <div className="filter-group">
              <h4>Price Range</h4>
              <label>
                <input 
                  type="radio" 
                  name="price" 
                  checked={activeFilters.price === 'Any'} 
                  onChange={() => handleFilterChange('price', 'Any')} 
                /> 
                Any
              </label>
              <label>
                <input 
                  type="radio" 
                  name="price" 
                  checked={activeFilters.price === 'Under ₹200'} 
                  onChange={() => handleFilterChange('price', 'Under ₹200')} 
                /> 
                Under ₹200
              </label>
              <label>
                <input 
                  type="radio" 
                  name="price" 
                  checked={activeFilters.price === '₹200-₹400'} 
                  onChange={() => handleFilterChange('price', '₹200-₹400')} 
                /> 
                ₹200 - ₹400
              </label>
              <label>
                <input 
                  type="radio" 
                  name="price" 
                  checked={activeFilters.price === 'Over ₹400'} 
                  onChange={() => handleFilterChange('price', 'Over ₹400')} 
                /> 
                Over ₹400
              </label>
            </div>
          </>
        )}

        <div className="filter-group">
          <h4>Sort By</h4>
          <label>
            <input 
              type="radio" 
              name="sortBy" 
              checked={activeFilters.sortBy === 'relevance'} 
              onChange={() => handleFilterChange('sortBy', 'relevance')} 
            /> 
            Relevance
          </label>
          <label>
            <input 
              type="radio" 
              name="sortBy" 
              checked={activeFilters.sortBy === 'rating'} 
              onChange={() => handleFilterChange('sortBy', 'rating')} 
            /> 
            Rating
          </label>
          <label>
            <input 
              type="radio" 
              name="sortBy" 
              checked={activeFilters.sortBy === 'price_asc'} 
              onChange={() => handleFilterChange('sortBy', 'price_asc')} 
            /> 
            Price: Low to High
          </label>
          <label>
            <input 
              type="radio" 
              name="sortBy" 
              checked={activeFilters.sortBy === 'price_desc'} 
              onChange={() => handleFilterChange('sortBy', 'price_desc')} 
            /> 
            Price: High to Low
          </label>
          <label>
            <input 
              type="radio" 
              name="sortBy" 
              checked={activeFilters.sortBy === 'name'} 
              onChange={() => handleFilterChange('sortBy', 'name')} 
            /> 
            Name (A-Z)
          </label>
        </div>
      </aside>

      <main className="search-results-content">
        <div className="search-header">
          <input 
            type="text" 
            className="search-bar-page"
            placeholder="Search for food or restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="sort-by">
            <label htmlFor="sort">Sort by:</label>
            <select 
              id="sort" 
              value={activeFilters.sortBy} 
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Rating</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
        
        <h2 className="results-heading">
          {searchQuery ? `Results for "${searchQuery}"` : "All Items"} 
          <span className="result-count">({filteredResults.length} items)</span>
        </h2>

        <div className="results-grid">
          {filteredResults.length > 0 ? (
            filteredResults.map(item => (
              item.type === "food" ? (
                <FoodItem 
                  key={`food-${item._id}`} 
                  id={item._id} 
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  image={item.image}
                  is_veg={item.is_veg}
                  restaurant_id={item.restaurant_id}
                />
              ) : (
                <RestaurantItem
                  key={`restaurant-${item._id}`}
                  id={item._id}
                  name={item.name}
                  cuisine={item.cuisine}
                  rating={item.rating}
                  time={item.timing || item.time}
                  image={item.image}
                  address={item.address}
                  price_for_two={item.price_for_two}
                  people={item.people}
                />
              )
            ))
          ) : (
            <div className="no-results">
              <h3>No items found</h3>
              <p>
                {searchQuery 
                  ? `No items match your search "${searchQuery}" or current filters.`
                  : "No items match your current filters."
                }
              </p>
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilters({
                    category: 'All',
                    rating: 0,
                    price: 'Any',
                    sortBy: 'relevance',
                    searchIn: 'All'
                  });
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;