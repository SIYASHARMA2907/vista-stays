//this file is used to create middleware

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //this function is used to check whether the person is logged in or not
    req.flash("error", "you must be logged in to create new listing");
    req.session.redirectUrl = req.originalUrl; //here the value of path will be saved which user was trying to fetch before getting log in request
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  //middleware to check user is owner of listing or not

  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    //if user is not owner of listing
    req.flash("error", "you are not the owner of listing ");
    return res.redirect(`/listings/${id}`); //if u don't use return than it will execute below option and will edit the listing
  }

  next();
};

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    console.error("Validation Error:", error);
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  //middleware to check user is owner of listing or not
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);

  if (!review.author._id.equals(res.locals.currUser._id)) {
    //if user is not owner of listing
    req.flash("error", "you are not the author of this review ");
    return res.redirect(`/listings/${id}`); //if u don't use return than it will execute below option and will edit the listing
  }
  next();
};
