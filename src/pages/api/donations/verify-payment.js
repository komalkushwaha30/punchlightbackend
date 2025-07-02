// src/pages/api/donations/verify-payment.js
import crypto from 'crypto';
import Donor from '@/models/Donor';
import dbConnect from '@/lib/dbConnect';
import cors from '@/lib/cors'; // ✅ Add CORS middleware


export default async function handler(req, res) {
  await cors(req, res);

  if (req.method !== 'POST') return res.status(405).end();

  await dbConnect();

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donorId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !donorId) {
    return res.status(400).json({ message: 'Missing payment details' });
  }

  const donor = await Donor.findById(donorId);
  if (!donor) return res.status(404).json({ message: 'Donor not found' });

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = hmac.digest('hex');

  donor.paymentId = razorpay_payment_id;
  donor.signature = razorpay_signature;

  if (digest === razorpay_signature) {
    donor.status = 'successful';
    await donor.save();
    return res.status(200).json({ success: true, message: 'Verified successfully' });
  } else {
    donor.status = 'failed';
    await donor.save();
    return res.status(400).json({ success: false, message: 'Signature mismatch' });
  }
}
