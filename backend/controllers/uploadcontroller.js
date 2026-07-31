import Upload from "../models/uploadmodel.js";
import uploadOnCloudinary from "../config/cloudinary.js";

// POST - Upload image
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file provided" });
        }

        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        // Upload to Cloudinary
        const imageUrl = await uploadOnCloudinary(req.file.path);

        if (!imageUrl) {
            return res.status(500).json({ message: "Error uploading image to Cloudinary" });
        }

        // Save metadata to MongoDB
        const newUpload = new Upload({
            title,
            description,
            imageUrl,
            uploadedBy: req.user?._id || null
        });

        await newUpload.save();

        res.status(201).json({
            message: "Image uploaded successfully",
            data: newUpload
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET - Fetch all uploaded images
export const getAllImages = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Check if database is connected
        if (!Upload.collection.conn.readyState) {
            return res.status(200).json({
                message: "Images fetched successfully (database offline)",
                total: 0,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: 0,
                data: []
            });
        }

        const uploads = await Promise.race([
            Upload.find()
                .populate("uploadedBy", "fullname email")
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Query timeout")), 5000))
        ]);

        const total = await Upload.countDocuments();

        res.status(200).json({
            message: "Images fetched successfully",
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit),
            data: uploads
        });

    } catch (error) {
        console.error("Fetch error:", error);
        // Return empty data instead of error
        res.status(200).json({
            message: "Images fetched (database temporarily unavailable)",
            total: 0,
            page: parseInt(req.query.page || 1),
            limit: parseInt(req.query.limit || 10),
            pages: 0,
            data: []
        });
    }
};
