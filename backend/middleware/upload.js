const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const uploadMiddleware = (req, res, next) => {
  console.log("in midle");
  if (req.file) {
    console.log("File already uploaded, skipping multer");
    return next();
  }
  console.log(req.body);
  upload.single("image")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res
        .status(400)
        .json({ status: "failed", msg: "File upload error: " + err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json({
        status: "failed",
        msg: "Unknown error occurred: " + err.message,
      });
    }

    // If no file was provided, just continue to the next middleware
    next();
  });
};

module.exports = uploadMiddleware;
