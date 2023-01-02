const { campgroundSchema, reviewSchema } = require("./schemas.js");
const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // console.log(req.originalUrl);
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  next();
};
module.exports.validateAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Campground does not exists");
    return res.redirect(`/campgrounds`);
  }
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have the permission to do that.");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    req.flash("error", "Invalid campground data!!");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    req.flash("error", "Error while adding review!!");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, review_id } = req.params;
  const review = await Review.findById(review_id);
  if (!review) {
    req.flash("error", "Review does not exists");
    return res.redirect(`/campgrounds/${id}`);
  }
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have the permission to do that.");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
