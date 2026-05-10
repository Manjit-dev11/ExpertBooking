const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
  expertName: { type: String, required: true },
  userName: { type: String, required: true, trim: true, maxlength: 100 },
  userEmail: { type: String, required: true, trim: true, lowercase: true },
  userPhone: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  notes: { type: String, default: '', maxlength: 500 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

// Indexes
BookingSchema.index({ userEmail: 1 });
BookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
