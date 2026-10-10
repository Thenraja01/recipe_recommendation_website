const prisma = require('../config/prisma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const config = require('../config/env');
const emailService = require('../services/email.service');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

const publicUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  role: user.role
});

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: config.jwt.cookieMaxAge
  });
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Invalidate old OTPs
    await prisma.OTP.updateMany({
      where: { email, used: false },
      data: { used: true }
    });

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await prisma.OTP.create({
      data: { email, otp, expiresAt }
    });

    const result = await emailService.sendOtpEmail(email, otp);

    res.json({
      message: 'OTP sent successfully',
      devOtp: result.devMode ? otp : undefined
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, username, password } = req.body;

    if (!email || !otp || !username || !password) {
      return res.status(400).json({ message: 'Email, OTP, username, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Verify OTP
    const otpRecord = await prisma.OTP.findFirst({
      where: {
        email,
        otp,
        used: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Mark OTP as used
    await prisma.OTP.update({
      where: { id: otpRecord.id },
      data: { used: true }
    });

    // Create user
    const hashedPassword = await bcrypt.hash(password, config.jwt.saltRounds);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword }
    });

    const token = generateToken(user.id);
    setTokenCookie(res, token);

    // Send welcome email (non-blocking)
    emailService.sendWelcomeEmail(email, username).catch(err => {
      console.error('Welcome email failed:', err.message);
    });

    res.status(201).json({
      message: 'Registered successfully',
      token,
      user: publicUser(user)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, config.jwt.saltRounds);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword }
    });

    const token = generateToken(user.id);
    setTokenCookie(res, token);

    res.status(201).json({
      message: 'Registered successfully',
      token,
      user: publicUser(user)
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    setTokenCookie(res, token);

    res.json({
      message: 'Login successful',
      token,
      user: publicUser(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged out' });
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        preferences: { include: { cuisines: true } }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        ...publicUser(user),
        preferences: user.preferences ? {
          dietary: user.preferences.dietary,
          maxDeliveryMinutes: user.preferences.maxDeliveryMinutes,
          preferredCuisines: user.preferences.cuisines?.map(item => item.cuisine) || [],
          allergens: user.preferences.allergens || []
        } : null
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email, avatar } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (username) updateData.username = username;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      updateData.email = email;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: publicUser(user)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { dietary, allergens } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (dietary) updateData.dietary = dietary;
    if (allergens !== undefined) updateData.allergens = allergens;

    const preference = await prisma.userPreference.upsert({
      where: { userId },
      create: {
        userId,
        dietary: dietary || 'ANY',
        allergens: allergens || []
      },
      update: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            role: true
          }
        },
        cuisines: true
      }
    });

    res.json({
      message: 'Preferences updated successfully',
      preference
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
