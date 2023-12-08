const express = require("express");
const multer = require("multer");

// const upload = multer({ dest: "images" });

const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storageConfig });
const router = express.Router();

router.get("/", function (req, res) {
  res.render("profiles");
});

router.get("/new-user", function (req, res) {
  res.render("new-user");
});

router.post("/profiles", upload.single("image"), function (req, res) {
  // req.file for uploaded image
  const uploadedImageFile = req.file;
  // req.body for username because it's only one other input
  const userData = req.body;
  console.log(uploadedImageFile);
  console.log(userData);
  res.redirect("/");
});

module.exports = router;
