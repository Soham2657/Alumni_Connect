const { User } = require('../models/User');
const { AlumniProfile } = require('../models/AlumniProfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

const generateId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, {
    expiresIn: '7d',
  });

const login = async (email, password) => {
  const user = await User.findOne({
    email: { $regex: new RegExp(`^${String(email)}$`, 'i') },
  });

  if (!user) return null;

  let ok = false;
  if (String(user.password).startsWith('$2')) {
    ok = await bcrypt.compare(password, user.password);
  } else {
    ok = user.password === password;
    if (ok) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }
  }

  if (!ok) return null;

  const leanUser = user.toObject();
  const token = signToken(leanUser);
  return { user: leanUser, token };
};

const register = async ({ name, email, password, role }) => {
  const duplicate = await User.exists({ email: { $regex: new RegExp(`^${String(email)}$`, 'i') } });
  if (duplicate) {
    return { error: 'Email already registered' };
  }

  const userId = generateId();
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: userId,
    name,
    email,
    password: hashedPassword,
    role,
    createdAt: new Date().toISOString(),
  };

  await User.create(newUser);

  if (role === 'alumni') {
    // Create a starter alumni profile so admin/alumni listings can show newly registered alumni.
    await AlumniProfile.findOneAndUpdate(
      { userId },
      {
        userId,
        name,
        email,
        graduationYear: new Date().getFullYear(),
        branch: 'Not specified',
        currentCompany: '',
        role: '',
        skills: [],
        location: '',
        bio: '',
        avatar: '',
        linkedin: '',
        industry: '',
        aiTags: [],
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  // Fetch the saved user from database to ensure all fields including role are persisted
  const savedUser = await User.findOne({ id: userId });
  if (!savedUser) {
    return { error: 'Failed to retrieve saved user' };
  }

  const leanUser = savedUser.toObject();
  const token = signToken(leanUser);
  return { user: leanUser, token };
};

module.exports = {
  login,
  register,
};
