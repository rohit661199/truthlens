import express from "express";
import multer from "multer";
import { uploadImage, getAllImages } from "../controllers/uploadcontroller.js";

const router = express.Router();

// Configure multer for file upload
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only JPEG, PNG, GIF, WebP allowed"));
        }
    }
});

// Routes
router.post("/upload", upload.single("image"), uploadImage);
router.get("/", getAllImages);

export default router;
