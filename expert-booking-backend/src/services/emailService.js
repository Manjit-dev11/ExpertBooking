const nodemailer = require('nodemailer');
const dns = require('dns');

// Force Node.js to use IPv4. This fixes the timeout error on Railway
// when trying to connect to Gmail's IPv6 address (2404:...).
dns.setDefaultResultOrder('ipv4first');

// Configure the SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false // Helps avoid SSL issues on some cloud providers
  },
  family: 4 // Force IPv4. This is the ultimate fix for the ESOCKET 2404:6800... error
});

/**
 * Send a booking confirmation email
 */
exports.sendBookingConfirmationEmail = async (booking, expertName) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP credentials not configured. Skipping confirmation email.');
    return;
  }

  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #00D4AA; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Booking Confirmed! ✅</h2>
        </div>
        <div style="padding: 20px; color: #333333;">
          <p>Hi <strong>${booking.userName}</strong>,</p>
          <p>Your session with <strong>${expertName}</strong> has been successfully booked!</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${booking.date}</p>
            <p style="margin: 5px 0;"><strong>⏰ Time:</strong> ${booking.timeSlot}</p>
            <p style="margin: 5px 0;"><strong>🎫 Booking Ref:</strong> #${booking._id.toString().toUpperCase()}</p>
          </div>
          
          <p>If you need to reschedule or cancel, you can manage your session in the ExpertBooking app.</p>
          <p style="margin-top: 30px;">Best regards,<br>The ExpertBooking Team</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"ExpertBooking" <${process.env.SMTP_USER}>`,
      to: booking.userEmail,
      subject: `Booking Confirmed: Session with ${expertName}`,
      html: html,
    });

    console.log('✅ Confirmation email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
  }
};

/**
 * Send a booking cancellation email
 */
exports.sendBookingCancellationEmail = async (booking, expertName) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP credentials not configured. Skipping cancellation email.');
    return;
  }

  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #FF4500; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Booking Cancelled ❌</h2>
        </div>
        <div style="padding: 20px; color: #333333;">
          <p>Hi <strong>${booking.userName}</strong>,</p>
          <p>Your session with <strong>${expertName}</strong> has been cancelled as requested.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${booking.date}</p>
            <p style="margin: 5px 0;"><strong>⏰ Time:</strong> ${booking.timeSlot}</p>
            <p style="margin: 5px 0;"><strong>🎫 Booking Ref:</strong> #${booking._id.toString().toUpperCase()}</p>
          </div>
          
          <p>We hope to see you again soon.</p>
          <p style="margin-top: 30px;">Best regards,<br>The ExpertBooking Team</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"ExpertBooking" <${process.env.SMTP_USER}>`,
      to: booking.userEmail,
      subject: `Booking Cancelled: Session with ${expertName}`,
      html: html,
    });

    console.log('✅ Cancellation email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Error sending cancellation email:', error);
  }
};
