/*import multer from "multer";
import path from "path";
import fs from "fs";

// base upload folder
const BASE_UPLOAD_DIR = "uploads";

// ensure base folder exists
if (!fs.existsSync(BASE_UPLOAD_DIR)) {
  fs.mkdirSync(BASE_UPLOAD_DIR);
}

// 🔥 dynamic upload creator
export const createUpload = (folderName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // optional: user-based folder
      const userId = req.params.userId || "common";

      const uploadPath = path.join(
        BASE_UPLOAD_DIR,
        folderName,
        userId
      );

      // create folder if not exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname);

      cb(null, uniqueName);
    }
  });

  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      const allowedExt = [".jpg", ".jpeg", ".png", ".doc", ".docx", ".pdf"];
      const ext = path.extname(file.originalname).toLowerCase();

      if (!allowedExt.includes(ext)) {
        return cb(new Error("File type is not supported"), false);
      }

      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
  });
};

// 🔥 delete file helper
export const deleteFile = (filePath) => {
  if (!filePath) return;

  const fullPath = path.join(process.cwd(), filePath);

  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) return; // file not exists

    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error("Failed to delete file:", err.message);
      }
    });
  });
};
*/



import multer from "multer";
import { Readable } from "stream";
import cloudinary from "./Cloudinary.js";

// 🔥 Dynamic upload creator
const createUpload = () => {
  return multer({
    storage: multer.memoryStorage(),

    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error("File type is not supported"), false);
      }

      cb(null, true);
    },

    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });
};

// 🔥 Upload file to Cloudinary
const uploadFile = (file, folderName, userId = "common") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `ShiftMatch_Cloud/${folderName}/${userId}`,
        resource_type: "auto",
        use_filename: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

// 🔥 Delete file from Cloudinary
const deleteFile = async (publicId, resourceType = "auto") => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Failed to delete file:", error.message);
  }
};

export { createUpload, uploadFile, deleteFile }

