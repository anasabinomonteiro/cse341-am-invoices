//Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) 
    return next();
  res.status(401).json({ error: 'Not authorized' });
}

module.exports = { isAuthenticated } ;