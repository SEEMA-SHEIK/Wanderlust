module.exports.isloggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //redirectURl
    req.session.redirectUrl = req.originalUrl;

    req.flash("error", "you must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
