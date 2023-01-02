const express = require("express");
const catchAsync = require("../utils/catchAsync");
const campgrounds = require("../controllers/campgrounds");
const {
  isLoggedIn,
  validateAuthor,
  validateCampground,
} = require("../middleware");

const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

const router = express.Router();

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    [isLoggedIn, upload.array("image"), validateCampground],
    catchAsync(campgrounds.addNewCampground)
  );

// router.post("/", upload.array("image"), (req, res) => {
//   console.log(req.body, req.files);
//   res.send("It worked");
// });

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.renderCampground))
  .put([isLoggedIn, validateAuthor, upload.array("image"), validateCampground], catchAsync(campgrounds.updateCampground))
  .delete(
    [isLoggedIn, validateAuthor],
    catchAsync(campgrounds.deleteCampground)
  );

router.get(
  "/:id/edit",
  [isLoggedIn, validateAuthor],
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
