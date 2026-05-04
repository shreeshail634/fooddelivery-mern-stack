import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById, getFoodByRestaurant } from '../services/restaurantService';
import FoodList from '../components/food/FoodList';
import Loader from '../components/common/Loader';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const [restData, foodData] = await Promise.all([
          getRestaurantById(id),
          getFoodByRestaurant(id)
        ]);
        setRestaurant(restData);
        setFoods(foodData);
      } catch (error) {
        console.error("Failed to fetch restaurant details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  if (loading) return <Loader />;
  if (!restaurant) return <div className="container mt-4">Restaurant not found.</div>;

  return (
    <div className="restaurant-details-page">
      <div className="restaurant-header">
        <div className="container">
          <h2>{restaurant.name}</h2>
          <p className="address">📍 {restaurant.address}</p>
          <p className="description">{restaurant.description}</p>
          <div className="rating">⭐ {restaurant.rating}</div>
        </div>
      </div>

      <div className="container mt-4">
        <h3 className="section-title">Menu</h3>
        <FoodList foods={foods} restaurantId={restaurant._id} />
      </div>
    </div>
  );
};

export default RestaurantDetails;
