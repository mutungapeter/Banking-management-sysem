// Middleware to check if user is an employee
module.exports = (req, res, next) => {
    if (req.userRole !== 'employee') {
      return res.status(403).json({ message: 'Access denied: Employees only' });
    }
    next();
  };