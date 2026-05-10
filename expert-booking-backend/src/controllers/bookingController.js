const Expert = require('../models/Expert');
const Booking = require('../models/Booking');
const { sendBookingConfirmationEmail, sendBookingCancellationEmail } = require('../services/emailService');

exports.createBooking = async (req, res) => {
  const { expertId, userName, userEmail, userPhone, date, timeSlot, notes } = req.body;

  // Atomic Slot Lock
  const updatedExpert = await Expert.findOneAndUpdate(
    {
      _id: expertId,
      availableSlots: {
        $elemMatch: {
          date: date,
          time: timeSlot,
          isBooked: false
        }
      }
    },
    {
      $set: { 'availableSlots.$.isBooked': true }
    },
    { new: true }
  );

  if (!updatedExpert) {
    const expertExists = await Expert.findById(expertId);
    if (!expertExists) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }
    return res.status(409).json({
      success: false,
      message: 'This slot is already booked. Please choose another time.',
      code: 'SLOT_TAKEN'
    });
  }

  // Create Booking
  const booking = await Booking.create({
    expertId,
    expertName: updatedExpert.name,
    userName,
    userEmail,
    userPhone,
    date,
    timeSlot,
    notes: notes || '',
    status: 'pending'
  });

  // Send Confirmation Email
  sendBookingConfirmationEmail(booking, updatedExpert.name);

  // Emit Socket Event
  const io = req.app.get('io');
  io.emit('slot:booked', {
    expertId,
    date,
    timeSlot,
    bookedBy: userEmail
  });

  res.status(201).json({
    success: true,
    message: 'Booking confirmed successfully!',
    data: { booking }
  });
};

exports.getBookingsByEmail = async (req, res) => {
  const email = req.query.email.toLowerCase();

  const bookings = await Booking.find({ userEmail: email })
    .sort({ createdAt: -1 })
    .populate('expertId', 'avatar category title hourlyRate');

  res.status(200).json({
    success: true,
    data: {
      bookings,
      total: bookings.length
    }
  });
};

exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await Booking.findById(id);

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  booking.status = status;
  await booking.save();

  // Free up the slot if cancelled
  if (status === 'cancelled') {
    await Expert.updateOne(
      {
        _id: booking.expertId,
        availableSlots: {
          $elemMatch: {
            date: booking.date,
            time: booking.timeSlot
          }
        }
      },
      {
        $set: { 'availableSlots.$.isBooked': false }
      }
    );

    // Optionally emit a WebSocket event so the slot instantly opens up on the frontend!
    const io = req.app.get('io');
    io.emit('slot:freed', {
      expertId: booking.expertId,
      date: booking.date,
      timeSlot: booking.timeSlot
    });

    // Send Cancellation Email
    sendBookingCancellationEmail(booking, booking.expertName);
  }

  res.status(200).json({
    success: true,
    message: 'Booking status updated',
    data: { booking }
  });
};
