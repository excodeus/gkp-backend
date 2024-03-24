const multer = require('multer');
const httpStatus = require('http-status');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const url = req.baseUrl;
    const urlArray = url.split('/').filter(Boolean);
    const lastIdx = urlArray.length - 1;
    const dir = urlArray[lastIdx];
    cb(null, `storage/uploads/${dir}`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Define file filter function
const fileFilter = (req, file, cb) => {
  // Accept only files with the specified extensions
  const allowedExtensions = ['.png', '.jpg', '.jpeg'];
  const ext = '.' + file.originalname.split('.').pop();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
  if (file.size > 5 * 1024 * 1024) {
    cb(null, false);
  }
};

// Create the multer instance with file filter and size limits
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
