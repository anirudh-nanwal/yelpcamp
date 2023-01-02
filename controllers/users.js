const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
}

module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registerUser = await User.register(user, password);
    req.login(registerUser, (err) => {
      if (err) next(err);
      req.flash("success", "Welcome to Yelp Camp!!");
      res.redirect("/campgrounds");
    });
  } catch (ex) {
    req.flash("error", ex.message);
    res.redirect("/register");
  }
}

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
}

module.exports.loginUser = (req, res) => {
  // console.log(req.session.returnTo);
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  req.flash("success", "Welcome back to YelpCamps!!");
  res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
}