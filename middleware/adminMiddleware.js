const admin = (req, res, next) => {
  if (req.user && req.user.admin) {
    next(); // user is admin → allow access
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

module.exports = { admin };
