const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define storage settings for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,"./images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Configure the multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize:  20 * 1024 * 1024  // Limit file size to 100MB
  },
});


module.exports = upload;