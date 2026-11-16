const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });


exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("📝 Registration request received:", { username, email });

  try {
    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'Username is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Check if user already exists by email
    const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (emailExists) return res.status(400).json({ error: 'Email already registered' });

    // Check if user already exists by username
    const usernameExists = await User.findOne({ username: username.trim() });
    if (usernameExists) return res.status(400).json({ error: 'Username already taken' });

    // Create the new user with username
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    console.log("✅ User created successfully in MongoDB:", user.username, user._id);

    // Generate JWT token
    const token = createToken(user._id);

    // Send response
    res.status(201).json({
      username: user.username,
      email: user.email,
      token
    });
  } catch (err) {
    console.error('❌ Registration error:', err); 
    res.status(500).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Username NOT matching' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Password NOT matching' });

    const token = createToken(user._id);
    res.status(200).json({ username: user.username, token});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Getting all users
exports.getTotalUsers = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ totalUsers: count });
  } catch (err) {
    console.error('Error fetching user count:', err);
    res.status(500).json({ error: 'Failed to fetch user count' });
  }
};
