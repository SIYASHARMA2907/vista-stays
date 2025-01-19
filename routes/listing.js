//file to restructuring listings route

const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js"); //accessing collection from listing.js
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); //a function to check whether person is logged in or not
const listingController = require("../controllers/listing.js");
const multer = require("multer"); //to upload files
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage }); //destination to store files

router
  .route("/") //all request in this route
  .get(wrapAsync(listingController.index)) //index route

  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing, //create route

    wrapAsync(listingController.createListing)
  );

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) //show route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  ) //update route
  .delete(isLoggedIn, isOwner, listingController.destroyListing); //delete route

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

module.exports = router;
