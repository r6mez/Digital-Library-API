const nodemailer = require("nodemailer");

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendVerificationEmail = async (email, name, verificationToken) => {
  const transporter = createTransporter();

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: `"Digital Library" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Email Verification - Digital Library",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Digital Library!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering with Digital Library. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account with us, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">Digital Library Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, resetToken) => {
  const transporter = createTransporter();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Digital Library" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Password Reset - Digital Library",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>You requested to reset your password for your Digital Library account. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #dc3545;">${resetUrl}</p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">Digital Library Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send book borrow confirmation email
const sendBookBorrowEmail = async (
  email,
  name,
  bookName,
  days,
  amount,
  returnDate
) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Digital Library" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Book Borrowed Successfully - Digital Library",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Book Borrowed Successfully!</h2>
        <p>Hi ${name},</p>
        <p>You have successfully borrowed the following book:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Book Details</h3>
          <p><strong>Name:</strong> ${bookName}</p>
          <p><strong>Borrow Duration:</strong> ${days} day(s)</p>
          <p><strong>Amount Paid:</strong> $${amount}</p>
          <p><strong>Return Date:</strong> ${new Date(
            returnDate
          ).toLocaleDateString()}</p>
        </div>
        
        <p>Please make sure to return the book by the due date to avoid any late fees.</p>
        <p>You can access your borrowed books from your dashboard.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">Digital Library Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send book purchase confirmation email
const sendBookPurchaseEmail = async (email, name, bookName, amount) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Digital Library" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Book Purchased Successfully - Digital Library",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Book Purchased Successfully!</h2>
        <p>Hi ${name},</p>
        <p>Congratulations! You have successfully purchased the following book:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #28a745; margin-top: 0;">Purchase Details</h3>
          <p><strong>Name:</strong> ${bookName}</p>
          <p><strong>Amount Paid:</strong> $${amount}</p>
          <p><strong>Purchase Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <p>This book is now permanently available in your library. You can access it anytime from your dashboard.</p>
        <p>Enjoy your reading!</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">Digital Library Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send offer purchase confirmation email
const sendOfferPurchaseEmail = async (
  email,
  name,
  offerDetails,
  bookNames,
  amount
) => {
  const transporter = createTransporter();

  const bookList = bookNames.map((name) => `<li>${name}</li>`).join("");

  const mailOptions = {
    from: `"Digital Library" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Offer Purchased Successfully - Digital Library",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Offer Purchased Successfully!</h2>
        <p>Hi ${name},</p>
        <p>You have successfully purchased a special offer with multiple books:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #ffc107; margin-top: 0;">Offer Details</h3>
          <p><strong>Offer:</strong> ${offerDetails}</p>
          <p><strong>Books Included:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            ${bookList}
          </ul>
          <p><strong>Total Amount Paid:</strong> $${amount}</p>
          <p><strong>Purchase Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <p>All books from this offer are now permanently available in your library.</p>
        <p>Great savings on your book collection!</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">Digital Library Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send subscription activation confirmation email
const sendSubscriptionActivationEmail = async (
  email,
  name,
  subscriptionName,
  amount,
  duration,
  maxBorrows,
  expiryDate
) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Digital Library" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Subscription Activated Successfully - Digital Library",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Subscription Activated Successfully!</h2>
        <p>Hi ${name},</p>
        <p>Your subscription has been activated successfully:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #6f42c1; margin-top: 0;">Subscription Details</h3>
          <p><strong>Plan:</strong> ${subscriptionName}</p>
          <p><strong>Amount Paid:</strong> $${amount}</p>
          <p><strong>Duration:</strong> ${duration} days</p>
          <p><strong>Maximum Borrows:</strong> ${maxBorrows} books</p>
          <p><strong>Expires On:</strong> ${new Date(
            expiryDate
          ).toLocaleDateString()}</p>
        </div>
        
        <p>You can now enjoy borrowing books within your subscription limits.</p>
        <p>Make the most of your subscription and happy reading!</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">Digital Library Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendBookBorrowEmail,
  sendBookPurchaseEmail,
  sendOfferPurchaseEmail,
  sendSubscriptionActivationEmail,
};
