import React from 'react';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

const Cart = () => {
  const { cartItems, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mt-4 cart-page empty">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4 cart-page">
      <h2>Your Cart</h2>
      <div className="cart-content">
        <div className="cart-items-container">
          <div className="cart-header">
            <h3>Items</h3>
            <button className="btn-link" onClick={clearCart}>Clear Cart</button>
          </div>
          {cartItems.map(item => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>
        <div className="cart-summary-container">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default Cart;
