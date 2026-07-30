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
    await prisma.oTP.updateMany({
      where: { email, used: false },
      data: { used: true }
    });

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await prisma.oTP.create({
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
    const otpRecord = await prisma.oTP.findFirst({
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
    await prisma.oTP.update({
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
          preferredCuisines: user.preferences.cuisines.map(item => item.cuisine)
        } : null
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
