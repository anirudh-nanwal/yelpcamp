require("dotenv").config();
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
// const images = require("./images");
const Campground = require("../models/campground");
// const axios = require("axios");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const options = {
  resource_type: "image",
  max_results: 500,
};

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("Connection successfull!!!");
  })
  .catch((err) => {
    console.log("Connection refused!!");
    console.log(err);
  });

const randomTitle = (array) => array[Math.floor(Math.random() * array.length)];

// const imageUrl = async () => {
//   const config = {
//     params: {
//       client_id: "hmGtZDSD-oF8grZqgznppbItdufo2jRiybzwqxBMmeU",
//       collections: "PHh1QTPf2ts",
//       count: 30,
//     },
//     headers: { Accept: "application/json", "Accept-Encoding": "identity" },
//   };
//   try {
//     const resp = await axios.get(
//       "https://api.unsplash.com/photos/random",
//       config
//     );
//     return resp.data.map((image) => image.urls.small);
//   } catch (err) {
//     console.log(err);
//   }
// };

const seedDb = async () => {
  await Campground.deleteMany({});
  // const imageUrls = await imageUrl();
  // console.log(imageUrls);
  // console.log(images)

  const images = [];
  await cloudinary.api.resources(options).then((res) => {
    // console.log(res.resources)
    res.resources.forEach((asset) => {
      if (asset.folder === "YelpCamp")
        images.push({ url: asset.secure_url, filename: asset.public_id });
    });
    console.log('here', images)
  });

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const numberOfImages = Math.floor(Math.random() * 4) + 1;
    const campgroundImages = [];
    for (let i = 0; i <= numberOfImages; i++) {
      const img = images[Math.floor(Math.random() * images.length) % images.length];
      if (campgroundImages.find((im) => im.url === img.url) !== undefined) i--;
      else campgroundImages.push(img);
    }
    const price = Math.floor(Math.random() * 20) + 10;
    const randomCity = cities[random1000];
    const geometry = {
      type: "Point",
      coordinates: [randomCity.longitude, randomCity.latitude],
    };
    const camp = new Campground({
      location: `${(randomCity.city, randomCity.state)}`,
      title: `${randomTitle(descriptors)} ${randomTitle(places)}`,
      // image: imageUrls[Math.floor(Math.random() * imageUrls.length)],
      images: campgroundImages,
      geometry: geometry,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit dolor, sed sit maiores, laudantium consequatur quia enim omnis amet totam quibusdam aspernatur optio. Quaerat asperiores vero minus, debitis maxime ea!",
      price: price,
      author: "63af74684c62ce75a5198f45",
    });
    await camp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
  console.log("Connection closed!!!");
});
