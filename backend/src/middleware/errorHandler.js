const errorHandler = (error, _req, res, _next) => {
  const message = error?.message || 'Internal server error';
  return res.status(500).json({ success: false, error: message });
};

module.exports = { errorHandler };
