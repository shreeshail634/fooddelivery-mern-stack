import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurants } from '../services/restaurantService';
import RestaurantList from '../components/restaurant/RestaurantList';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (error) {
        console.error("Failed to fetch restaurants", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const results = restaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (restaurant.cuisineType && restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredRestaurants(results);
  }, [searchTerm, restaurants]);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Delicious Food, Delivered To You</h1>
          <p>Choose from your favorite restaurants and get your meals delivered hot and fresh.</p>
        </div>
      </section>

      <section className="container mt-4">
        {user && (
          <div className="profile-greeting">
            <h2>Welcome back, {user.name}! 👋</h2>
            <p>Ready for your next delicious meal? <Link to="/orders">View your recent orders</Link></p>
          </div>
        )}

        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search restaurants or cuisines..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <h2 className="section-title">Popular Restaurants</h2>
        {loading ? <Loader /> : <RestaurantList restaurants={filteredRestaurants} />}
      </section>
    </div>
  );
};

export default Home;
