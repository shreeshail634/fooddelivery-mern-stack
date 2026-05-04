import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

export const processPayment = async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Mock payment processing
    const isSuccess = Math.random() > 0.1; // 90% success rate

    if (isSuccess) {
      const payment = new Payment({
        order: orderId,
        user: req.user._id,
        amount,
        method,
        status: 'Completed',
        transactionId: `mock_tx_${Date.now()}`
      });

      await payment.save();
      
      order.paymentStatus = 'Paid';
      await order.save();

      res.status(200).json({ message: 'Payment successful', payment });
    } else {
      const payment = new Payment({
        order: orderId,
        user: req.user._id,
        amount,
        method,
        status: 'Failed'
      });

      await payment.save();
      order.paymentStatus = 'Failed';
      await order.save();

      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
