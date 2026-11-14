import multer from "multer";
import imagekit from "../config/imagekit.js";

const memoryStorage = multer.memoryStorage();
const baseMulter = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

/**
 * Middleware that uploads the multer file buffer directly to ImageKit.
 */
export const uploadToImageKitMiddleware = (folder = "resumes") => {
  return async (req, res, next) => {
    if (!req.file) return next();
    try {
      const response = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: `/${folder}`,
      });
      req.file.path = response.url;
      req.file.url = response.url;
      req.file.fileId = response.fileId;
      req.file.thumbnailUrl = response.thumbnailUrl || response.url;
      next();
    } catch (err) {
      console.error("ImageKit upload error:", err);
      return res.status(500).json({ message: "Failed to upload file to ImageKit", error: err.message });
    }
  };
};

const upload = {
  single: (fieldName, folder = "resumes") => [
    baseMulter.single(fieldName),
    uploadToImageKitMiddleware(folder),
  ],
  array: (fieldName, maxCount = 5, folder = "uploads") => [
    baseMulter.array(fieldName, maxCount),
    async (req, res, next) => {
      if (!req.files || req.files.length === 0) return next();
      try {
        for (const file of req.files) {
          const resp = await imagekit.upload({
            file: file.buffer,
            fileName: `${Date.now()}-${file.originalname}`,
            folder: `/${folder}`,
          });
          file.path = resp.url;
          file.url = resp.url;
          file.fileId = resp.fileId;
        }
        next();
      } catch (err) {
        return res.status(500).json({ message: "Failed to upload files to ImageKit", error: err.message });
      }
    },
  ],
};

export default upload;
