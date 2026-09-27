const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { issueAccessToken, issueRefreshToken, setRefreshCookie, hashToken } = require('../utils/tokens');

const safeUser = (user) => ({ 
  id: user._id, 
  name: user.name, 
  email: user.email, 
  createdAt: user.createdAt 
});

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (await User.findOne({ email }))

      return res.status(409).json({
        message: 'An account with this email already exists.'
      });

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12)
    });

    res.status(201).json({

      message: 'Account created. Please log in.', user: safeUser(user)
    });

  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {

    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await bcrypt.compare(req.body.password, user.password)))

      return res.status(401).json({
        message: 'Invalid email or password.'
      });

    const refreshToken = issueRefreshToken(user);
    user.refreshTokenHash = await hashToken(refreshToken);

    await user.save();

    setRefreshCookie(res, refreshToken);

    res.json({
      message: 'Logged in successfully.',
      accessToken: issueAccessToken(user),
      user: safeUser(user)
    });

  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res, next) => {

  try {
    const token = req.cookies.refreshToken;

    if (!token) return res.status(401).json({
      message: 'Refresh token missing. Please log in again.'
    });

    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.id);

    if (!user?.refreshTokenHash || !(await bcrypt.compare(token, user.refreshTokenHash)))

      return res.status(403).json({
        message: 'Refresh token is no longer valid. Please log in again.'
      });

    res.json({ accessToken: issueAccessToken(user) });

  } catch (error) {

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')
      
      return res.status(401).json({
        message: 'Invalid or expired refresh token.'
      });

    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshTokenHash: null });

    res.clearCookie('refreshToken');

    res.json({
      message: 'Logged out successfully.'
    });
  }
  catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: safeUser(user) });
  } catch (error) {
    next(error);
  }
};
