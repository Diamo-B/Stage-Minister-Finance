// multerConfig.ts
import multer from 'multer';

// Create a storage engine to define where uploaded files will be saved
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../../public/'); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Set the filename of the uploaded file
  },
});

export const upload = multer({ storage: storage });