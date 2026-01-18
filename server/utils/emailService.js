import sgMail from "@sendgrid/mail";
import QRCode from "qrcode";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateQRCode = async (ticketNumber) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(ticketNumber);
    return qrCodeDataURL.split(',')[1];
  } catch (err) {
    console.error("QR Code generation failed:", err);
    throw err;
  }
};

export const sendTicketEmail = async (userEmail, userName, tickets, eventDetails) => {
  try {
    
    const attachments = [];
    
    for (let i = 0; i < tickets.length; i++) {
      const qrCodeBase64 = await generateQRCode(tickets[i].ticketNumber);
      attachments.push({
        content: qrCodeBase64,
        filename: `ticket-${i + 1}-qr-code.png`,
        type: "image/png",
        disposition: "attachment"
      });
    }
  
    const ticketsHTML = tickets
      .map(
        (ticket, index) => `
        <div style="border: 2px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 10px; background-color: #f9f9f9;">
          <h3 style="color: #333;">Ticket ${index + 1} of ${tickets.length}</h3>
          <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
          <p><strong>Status:</strong> ${ticket.status}</p>
        </div>
      `
      )
      .join("");

    const msg = {
      to: userEmail,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `Your Tickets for ${eventDetails.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4CAF50; text-align: center;">🎟️ Your Tickets Are Ready!</h1>
          
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #333;">Event Details</h2>
            <p><strong>Event:</strong> ${eventDetails.title}</p>
            <p><strong>Date:</strong> ${new Date(eventDetails.date).toLocaleDateString()}</p>
            <p><strong>Number of Tickets:</strong> ${tickets.length}</p>
            <p><strong>Total Amount:</strong> ₹${eventDetails.price * tickets.length}</p>
          </div>
          <h2 style="color: #333;">Your Tickets</h2>
          ${ticketsHTML}
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;"><strong>⚠️ Important:</strong> Please bring these tickets (printed or on your phone) to the event. Each QR code is attached to this email and will be scanned at the entrance.</p>
          </div>
          <p style="text-align: center; color: #666; font-size: 14px;">
            Thank you for your purchase! We look forward to seeing you at the event.
          </p>
        </div>
      `,
      attachments: attachments
    };

    await sgMail.send(msg);
    console.log("Ticket email sent successfully to:", userEmail);
  } catch (err) {
    console.error("Failed to send ticket email:", err);
    throw err;
  }
};