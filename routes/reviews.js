const express = require("express");
const catchAsync = require("../utils/catchAsync");
const reviews = require("../controllers/reviews");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const router = express.Router({ mergeParams: true });

router.post("/", [isLoggedIn, validateReview], catchAsync(reviews.addReview));

router.delete(
  "/:review_id",
  [isLoggedIn, isReviewAuthor],
  catchAsync(reviews.deleteReview)
);

module.exports = router;
