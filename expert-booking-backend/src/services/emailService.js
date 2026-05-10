const nodemailer = require('nodemailer');
const dns = require('dns');

// Force Node.js to use IPv4. This fixes the timeout error on Railway
// when trying to connect to Gmail's IPv6 address (2404:...).
dns.setDefaultResultOrder('ipv4first');

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  try {
    const hostname = process.env.SMTP_HOST || 'smtp.gmail.com';
    // Manually resolve IPv4 to bypass Railway/Windows IPv6 issues
    const { address } = await dns.promises.lookup(hostname, { family: 4 });
    
    transporter = nodemailer.createTransport({
      host: address,
      // FORCE Port 587 and secure false, because Port 465 is often blocked by cloud firewalls
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        servername: hostname, // Keep SSL certificate valid
        rejectUnauthorized: false
      }
    });
    
    return transporter;
  } catch (err) {
    console.error('⚠️ Could not resolve SMTP host, falling back to default config:', err);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false }
    });
    return transporter;
  }
}

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

    const tp = await getTransporter();
    const info = await tp.sendMail({
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

    const tp = await getTransporter();
    const info = await tp.sendMail({
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
