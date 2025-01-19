//file to restructure review schema by express router

const express = require("express");
const router = express.Router({ mergeParams: true }); //to save the parent route or insimple to pass id from app.js
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js"); //accessing collection from listing.js
const Review = require("../models/review.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js"); //a function to check whether person is logged in or not
const reviewController = require("../controllers/review.js");

//reviews
//post route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
