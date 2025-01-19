//file that handles the logic for specific application routes

const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"); //using geocoding
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); //object to work regarding geocoding

//index route
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

//new route
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//create route
module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; //directly inserting id of user who logged in
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;

  let savedListing = await newListing.save(); //inserting inside db
  req.flash("success", "New listing created"); // flash is created so that whenever u create a post this message will come at starting and success is key for this msg
  res.redirect("/listings");
};

//show route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      //nested populate
      path: "reviews", //populating reviews with listing
      populate: {
        //for individual reviews populating it's author
        path: "author",
      },
    })
    .populate("owner"); //accessing all info by id , by populate we send object of review

  if (!listing) {
    //this will flash when either your requested listing is deleted or not available
    req.flash("error", " listing you are requested doesn't existed");
    res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

//edit route

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    //this will flash when either your requested listing is deleted or not available
    req.flash("error", " listing you are requested doesn't existed");
    res.redirect(`/listings`);
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

//update route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    //if image is updated
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", " listing is updated");
  res.redirect(`/listings/${id}`);
};

//delete route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", " listing is deleted");
  res.redirect("/listings");
};
