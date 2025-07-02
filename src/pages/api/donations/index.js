// src/pages/api/donations/index.js
import Donor from '@/models/Donor';
import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  await dbConnect();

  try {
    const donors = await Donor.find({ status: 'successful' }).sort({ createdAt: -1 });
    res.status(200).json(donors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching donors' });
  }
}
