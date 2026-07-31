import mongoose from "mongoose"

const uploadSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
        required: true
    },
    cloudinaryId: {
        type: String,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Upload = mongoose.model("Upload", uploadSchema);
export default Upload;
