mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "cluster-map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 11, // starting zoom
});
// Set marker options.

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker({
  color: "#F55742",
  draggable: true,
})
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>`)
  )
  .addTo(map);
