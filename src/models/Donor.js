// src/models/Donor.js
import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
  },
  amount: { type: Number, required: true, min: 0.01 },
  paymentId: { type: String, unique: true, sparse: true },
  orderId: { type: String, unique: true, sparse: true },
  signature: { type: String, sparse: true },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

donorSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Donor || mongoose.model('Donor', donorSchema);
