import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    if (!filePath || !fs.existsSync(filePath)) {
        console.error('Missing required parameter - file');
        return null;
    }
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto', // auto-detect file type (image, video, etc.)
        });
        fs.unlinkSync(filePath);
        return result.secure_url;
    } catch (error) {
        // Attempt to remove the file if it exists
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (err) {
            console.error('Error removing file:', err);
        }
        console.error(error);
        return null;
    }
};

export default uploadOnCloudinary;