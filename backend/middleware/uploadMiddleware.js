import multer from 'multer';

// We use memory storage so we don't clog up your computer with saved files.
// It holds the file in memory, we upload it to Cloudinary, and then it vanishes!
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Restrict files to 5MB max
});

export default upload;