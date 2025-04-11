import path from "path";
import multer from "multer";

// Configure storage
const storage = multer.memoryStorage(); // Store in memory for Cloudinary upload

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error("Only images (JPEG, JPG, PNG) are allowed"));
};

// Multer middleware
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

export default upload;
