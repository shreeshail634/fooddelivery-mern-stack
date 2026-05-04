import React, { useEffect, useContext, useState } from 'react';
import { OrderContext } from '../context/OrderContext';
import Loader from '../components/common/Loader';
import { formatPrice } from '../utils/formatPrice';

const Orders = () => {
  const { orders, loading, fetchOrders } = useContext(OrderContext);
  const [trackingOrder, setTrackingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mt-4 orders-page">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h4>Order #{order._id.substring(order._id.length - 6)}</h4>
                <span className={`status badge-${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <p className="date">{new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="total">Total: {formatPrice(order.totalAmount)}</p>
              
              <button 
                className="btn btn-outline btn-sm mt-2"
                onClick={() => setTrackingOrder(trackingOrder === order._id ? null : order._id)}
              >
                {trackingOrder === order._id ? 'Hide Details' : 'Track Order'}
              </button>

              {trackingOrder === order._id && (
                <div className="tracking-details">
                  <div className="tracking-timeline">
                    <div className={`step ${order.status !== 'Cancelled' ? 'active' : ''}`}>Placed</div>
                    <div className={`step ${['Preparing', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'active' : ''}`}>Preparing</div>
                    <div className={`step ${['Out for Delivery', 'Delivered'].includes(order.status) ? 'active' : ''}`}>Out for Delivery</div>
                    <div className={`step ${order.status === 'Delivered' ? 'active' : ''}`}>Delivered</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
