const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });
const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({}).populate("popupText");
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.addNewCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Campground created successfully!!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.renderCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Camground does not exists!!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Camground does not exists!!");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;
  const deleteImages = req.body.deleteImages || [];
  const imgs = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  campground.images = campground.images.filter((campImage) => {
    return !deleteImages.includes(campImage.filename);
  });
  campground.images.push(...imgs);
  campground.save();
  // This is from lecture.
  // if (deleteImages !== []) {
  //   await Campground.updateOne({
  //     $pull: { images: { filename: { $in: deleteImages } } },
  //   });
  //   // deleting images from cloudinary, but this will mess up our seeds. So be carefull when deleting images from cloudinary
  //   // for (let filename of deleteImages) {
  //   //   await cloudinary.uploader.destroy(filename);
  //   // }
  // }
  req.flash("success", "Campground updated successfully!!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground deleted successfully!!");
  res.redirect("/campgrounds");
};
