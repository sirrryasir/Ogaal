import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createUser, findUserByEmail, createPasswordResetToken, findPasswordResetToken, deletePasswordResetToken, updateUserPassword } from '../models/authModel';

// Helper functions for validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isStrongPassword = (password: string): boolean => {
  // At least 6 characters
  return password.length >= 6;
};

const validateRegisterInput = (email: string, password: string, fullName: string): string | null => {
  if (!email || !email.trim()) return 'Email is required';
  if (!isValidEmail(email.trim())) return 'Invalid email format';
  if (!password || !password.trim()) return 'Password is required';
  if (!isStrongPassword(password.trim())) return 'Password must be at least 6 characters long';
  if (!fullName || !fullName.trim()) return 'Full name is required';
  return null;
};

const validateLoginInput = (email: string, password: string): string | null => {
  if (!email || !email.trim()) return 'Email is required';
  if (!isValidEmail(email.trim())) return 'Invalid email format';
  if (!password || !password.trim()) return 'Password is required';
  return null;
};

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName } = req.body;

    // Sanitize inputs
    const sanitizedEmail = email?.trim().toLowerCase();
    const sanitizedPassword = password?.trim();
    const sanitizedFullName = fullName?.trim();

    // Validate inputs
    const validationError = validateRegisterInput(sanitizedEmail, sanitizedPassword, sanitizedFullName);
    if (validationError) {
      res.status(400).json({ message: validationError });
      return;
    }

    // Check if user exists
    const existingUser = await findUserByEmail(sanitizedEmail);
    if (existingUser) {
      res.status(409).json({ message: 'Email already in use' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(sanitizedPassword, 12);

    // Create user
    const user = await createUser(sanitizedEmail, hashedPassword, sanitizedFullName);

    // Ensure JWT_SECRET is set
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET not set');
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });

    // Return success with token and user data
    res.status(201).json({
      token,
      user: {
        id: user.id.toString(),
        email: user.email,
        fullName: user.fullName,
      },
    });
    return;
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Sanitize inputs
    const sanitizedEmail = email?.trim().toLowerCase();
    const sanitizedPassword = password?.trim();

    // Validate inputs
    const validationError = validateLoginInput(sanitizedEmail, sanitizedPassword);
    if (validationError) {
      res.status(400).json({ message: validationError });
      return;
    }

    // Find user
    const user = await findUserByEmail(sanitizedEmail);
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(sanitizedPassword, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Ensure JWT_SECRET is set
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET not set');
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user.id.toString(),
        email: user.email,
        fullName: user.fullName,
      },
    });
    return;
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Sanitize input
    const sanitizedEmail = email?.trim().toLowerCase();

    // Validate input
    if (!sanitizedEmail || !isValidEmail(sanitizedEmail)) {
      res.status(400).json({ message: 'Invalid email format' });
      return;
    }

    // Find user (don't reveal if user exists)
    const user = await findUserByEmail(sanitizedEmail);
    if (!user) {
      // Return success to prevent email enumeration
      res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token
    await createPasswordResetToken(user.id, hashedToken, expiresAt);

    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetUrl = `http://${process.env.BACKEND_IP}:3000/api/user/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@barwaaqo.com',
      to: sanitizedEmail,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset for your Barwaaqo account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    // Validate input
    if (!token || !newPassword || !isStrongPassword(newPassword)) {
      res.status(400).json({ message: 'Invalid token or password' });
      return;
    }

    // Hash the token to match stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find token
    const resetToken = await findPasswordResetToken(hashedToken);
    if (!resetToken || resetToken.expiresAt < new Date()) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await updateUserPassword(resetToken.userId, hashedPassword);

    // Delete token
    await deletePasswordResetToken(hashedToken);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const redirectToApp = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;
  const appUrl = `${process.env.EXPO_DEV_URL}/--/reset-password/${token}`;
  res.redirect(appUrl);
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  redirectToApp
};