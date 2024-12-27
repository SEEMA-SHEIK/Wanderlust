const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { JoiListingSchema } = require("../schema.js");
const { isloggedIn } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
  let { error } = JoiListingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isloggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//New Route -to add new listing
router.get("/new", isloggedIn, wrapAsync(listingController.renderNewForm));

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isloggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isloggedIn, wrapAsync(listingController.deleteListing));

//Index Route
// router.get("/", wrapAsync(listingController.index));

//Show Route
// router.get("/:id", wrapAsync(listingController.showListing));

//Create Route - TO create a new listing
// router.post(
//   "/",
//   isloggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing)
// );

//Edit Route - To edit the listing
router.get("/:id/edit", isloggedIn, wrapAsync(listingController.editListing));

//Update route - from old listing which is edited
// router.put(
//   "/:id",
//   isloggedIn,
//   validateListing,
//   wrapAsync(listingController.updateListing)
// );

//Delete Route
// router.delete("/:id", isloggedIn, wrapAsync(listingController.deleteListing));

module.exports = router;
