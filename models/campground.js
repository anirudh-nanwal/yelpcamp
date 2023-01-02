const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.methods.resize = function (width, height, crop) {
  return this.url.replace(
    "/upload",
    `/upload/w_${width},h_${height}${crop ? "," + crop : ""}`
  );
};

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
  title: { type: String, required: true },
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
}, opts);


CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`
});

CampgroundSchema.post("findOneAndDelete", async (campground) => {
  if (campground) {
    await Review.deleteMany({
      _id: { $in: campground.reviews },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
