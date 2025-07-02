// src/pages/api/donations/create-order.js
import Razorpay from 'razorpay';
import Donor from '@/models/Donor';
import dbConnect from '@/lib/dbConnect';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  await dbConnect();

  const { name, email, amount } = req.body;

  if (!name || !email || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Name, email, and valid amount required.' });
  }

  try {
    const newDonor = new Donor({ name, email, amount: amount / 100, status: 'pending' });
    await newDonor.save();

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_order_${newDonor._id}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    newDonor.orderId = order.id;
    await newDonor.save();

    res.status(200).json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
      keyId: process.env.RAZORPAY_KEY_ID,
      donorId: newDonor._id,
    });
  } catch (err) {
    console.error(err,"6666666666666666666666666666");
    res.status(500).json({ message: 'Failed to create order.' });
  }
}
