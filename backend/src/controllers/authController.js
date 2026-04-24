const authService = require('../services/authService');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  const result = await authService.login(email, password);
  if (!result) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const { password: _password, ...safeUser } = result.user;
  return res.json({ success: true, user: safeUser, token: result.token });
};

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, error: 'Name, email, password and role are required' });
  }

  if (!['alumni', 'student'].includes(role)) {
    return res.status(400).json({ success: false, error: 'Invalid role' });
  }

  const result = await authService.register({ name, email, password, role });
  if (result.error) {
    return res.status(409).json({ success: false, error: result.error });
  }

  const { password: _password, ...safeUser } = result.user;
  return res.status(201).json({ success: true, user: safeUser, token: result.token });
};

const me = async (req, res) => {
  return res.json({ success: true, user: req.user });
};

module.exports = {
  login,
  register,
  me,
};
