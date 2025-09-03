import React, { useContext, useState, useEffect } from 'react';
import './SearchPage.css';
import { StoreContext } from '../../Context/StoreContext';
import { RestaurantContext } from '../../Context/RestaurantContext';
import FoodItem from '../../components/FoodItem/FoodItem';
import RestaurantItem from "../../components/RestaurantItem/RestaurantItem";
const SearchPage = () => {
  const { food_list } = useContext(StoreContext);
  const { restaurant_list } = useContext(RestaurantContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    category: 'All',
    rating: 0,
    price: 'Any',
    sortBy: 'relevance',
    searchIn: 'All' // NEW → All, Foods, Restaurants
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
    if (searchQuery) {
      results = results.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filters for foods only
    if (activeFilters.searchIn !== "Restaurants") {
      if (activeFilters.category !== 'All') {
        results = results.filter(item => item.type === "food" && item.category === activeFilters.category);
      }
      if (activeFilters.rating > 0) {
        results = results.filter(item => item.rating >= activeFilters.rating);
      }
      if (activeFilters.price !== 'Any') {
        results = results.filter(item => {
          if (item.type !== "food") return true; // skip restaurants for price filter
          if (activeFilters.price === 'Under ₹200') return item.price < 200;
          if (activeFilters.price === '₹200-₹400') return item.price >= 200 && item.price <= 400;
          if (activeFilters.price === 'Over ₹400') return item.price > 400;
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
          return (a.price || 0) - (b.price || 0);
        case 'price_desc':
          return (b.price || 0) - (a.price || 0);
        default:
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

  return (
    <div className="search-page">
      <aside className="filter-sidebar">
        <h3>Filters</h3>

        {/* NEW → Search In filter */}
        <div className="filter-group">
          <h4>Search In</h4>
          <label><input type="radio" name="searchIn" checked={activeFilters.searchIn === 'All'} onChange={() => handleFilterChange('searchIn', 'All')} /> All</label>
          <label><input type="radio" name="searchIn" checked={activeFilters.searchIn === 'Foods'} onChange={() => handleFilterChange('searchIn', 'Foods')} /> Foods</label>
          <label><input type="radio" name="searchIn" checked={activeFilters.searchIn === 'Restaurants'} onChange={() => handleFilterChange('searchIn', 'Restaurants')} /> Restaurants</label>
        </div>

        {/* Keep food-only filters visible only if searching foods */}
        {activeFilters.searchIn !== "Restaurants" && (
          <>
            <div className="filter-group">
              <h4>Category</h4>
              <label><input type="radio" name="category" checked={activeFilters.category === 'All'} onChange={() => handleFilterChange('category', 'All')} /> All</label>
              <label><input type="radio" name="category" checked={activeFilters.category === 'Veg'} onChange={() => handleFilterChange('category', 'Veg')} /> Veg</label>
              <label><input type="radio" name="category" checked={activeFilters.category === 'Non-Veg'} onChange={() => handleFilterChange('category', 'Non-Veg')} /> Non-Veg</label>
            </div>

            <div className="filter-group">
              <h4>Rating</h4>
              <label><input type="radio" name="rating" checked={activeFilters.rating === 4} onChange={() => handleFilterChange('rating', 4)} /> 4 ★ & above</label>
              <label><input type="radio" name="rating" checked={activeFilters.rating === 3} onChange={() => handleFilterChange('rating', 3)} /> 3 ★ & above</label>
              <label><input type="radio" name="rating" checked={activeFilters.rating === 0} onChange={() => handleFilterChange('rating', 0)} /> All Ratings</label>
            </div>
            
            <div className="filter-group">
              <h4>Price Range</h4>
              <label><input type="radio" name="price" checked={activeFilters.price === 'Any'} onChange={() => handleFilterChange('price', 'Any')} /> Any</label>
              <label><input type="radio" name="price" checked={activeFilters.price === 'Under ₹200'} onChange={() => handleFilterChange('price', 'Under ₹200')} /> Under ₹200</label>
              <label><input type="radio" name="price" checked={activeFilters.price === '₹200-₹400'} onChange={() => handleFilterChange('price', '₹200-₹400')} /> ₹200 - ₹400</label>
              <label><input type="radio" name="price" checked={activeFilters.price === 'Over ₹400'} onChange={() => handleFilterChange('price', 'Over ₹400')} /> Over ₹400</label>
            </div>
          </>
        )}
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
            <select id="sort" value={activeFilters.sortBy} onChange={(e) => handleFilterChange('sortBy', e.target.value)}>
              <option value="relevance">Relevance</option>
              <option value="rating">Rating</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
        
        <h2 className="results-heading">
          {searchQuery ? `Results for "${searchQuery}"` : "All Items"}
        </h2>

        <div className="results-grid">
          {filteredResults.length > 0 ? (
            filteredResults.map(item => (
              item.type === "food" ? (
                <FoodItem 
                  key={item._id} 
                  id={item._id} 
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  image={item.image}
                />
              ) : (
<RestaurantItem
  key={item._id}
  id={item._id}
  name={item.name}
  cuisine={item.cuisine}
  rating={item.rating}
  time={item.time}
  image={item.image}
  address={item.address}
  price_for_two={item.price_for_two}
/>
              )
            ))
          ) : (
            <p className="no-results">No items match your search or filters.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
