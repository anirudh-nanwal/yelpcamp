const Review = require("../models/review")
const Campground = require("../models/campground")

module.exports.addReview = async (req, res, next) => {
  const { id } = req.params;
  const review = new Review(req.body.review);
  review.author = req.user._id;
  const campground = await Campground.findById(id);
  campground.reviews.push(review);
  await campground.save();
  await review.save();
  req.flash("success", "Review added successfully!!");
  res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview = async (req, res, next) => {
  const { id, review_id } = req.params;
  await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: review_id },
  });
  await Review.findByIdAndDelete(review_id);
  req.flash("success", "Review deleted successfully!!");
  res.redirect(`/campgrounds/${id}`);
}