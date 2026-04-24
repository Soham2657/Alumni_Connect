const { User } = require('../models/User');
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

  const user = {
    id: generateId(),
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role,
    createdAt: new Date().toISOString(),
  };

  await User.create(user);

  const token = signToken(user);
  return { user, token };
};

module.exports = {
  login,
  register,
};
