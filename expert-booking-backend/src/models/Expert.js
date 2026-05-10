const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ExpertSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  avatar: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxlength: 150 },
  category: { 
    type: String, 
    required: true, 
    enum: ['Tech', 'Design', 'Business', 'Marketing', 'Finance', 'Health'] 
  },
  experience: { type: Number, required: true, min: 0, max: 50 },
  rating: { type: Number, default: 5.0, min: 1, max: 5 },
  reviewCount: { type: Number, default: 0 },
  hourlyRate: { type: Number, required: true, min: 0 },
  bio: { type: String, required: true, maxlength: 1000 },
  skills: [{ type: String, trim: true }],
  isVerified: { type: Boolean, default: false },
  totalSessions: { type: Number, default: 0 },
  availableSlots: [
    {
      date: { type: String, required: true },
      time: { type: String, required: true },
      isBooked: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });

ExpertSchema.plugin(mongoosePaginate);

// Indexes
ExpertSchema.index({ category: 1 });
ExpertSchema.index({ name: 'text', title: 'text', bio: 'text' });

module.exports = mongoose.model('Expert', ExpertSchema);
