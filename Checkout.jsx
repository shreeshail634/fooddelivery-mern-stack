import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { createOrder } from '../services/orderService';
import { processPayment } from '../services/paymentService';
import { calculateTotal } from '../utils/calculateTotal';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const subtotal = calculateTotal(cartItems);
  const uniqueRestaurants = new Set(cartItems.map(item => item.restaurantId)).size;
  const deliveryFee = uniqueRestaurants * 5.00;
  const totalAmount = subtotal + deliveryFee;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // Group items by restaurant
      const groupedItems = cartItems.reduce((acc, item) => {
        if (!acc[item.restaurantId]) acc[item.restaurantId] = [];
        acc[item.restaurantId].push(item);
        return acc;
      }, {});

      // Create an order for each restaurant
      for (const [restId, items] of Object.entries(groupedItems)) {
        const restSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const restTotal = restSubtotal + 5.00; // $5 delivery fee per restaurant
        
        const formattedItems = items.map(item => ({
          food: item._id,
          quantity: item.quantity,
          price: item.price
        }));

        const newOrder = await createOrder({
          restaurant: restId,
          items: formattedItems,
          totalAmount: restTotal,
          deliveryAddress: address
        });

        await processPayment({
          orderId: newOrder._id,
          amount: restTotal,
          method: paymentMethod
        });
      }

      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mt-4 checkout-page">
      <h2>Checkout</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleCheckout} className="checkout-form">
        <div className="form-group">
          <label>Delivery Address</label>
          <textarea 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            required 
            rows="3"
            placeholder="Enter your full delivery address"
          ></textarea>
        </div>
        <div className="form-group">
          <label>Payment Method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>
        <div className="checkout-summary">
          <h4>Subtotal: ${subtotal.toFixed(2)}</h4>
          <h4>Delivery Fee: ${deliveryFee.toFixed(2)} ({uniqueRestaurants} restaurant{uniqueRestaurants > 1 ? 's' : ''})</h4>
          <h3>Total to Pay: ${totalAmount.toFixed(2)}</h3>
        </div>
        <button 
          type="submit" 
          className="btn btn-primary btn-block mt-4"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
