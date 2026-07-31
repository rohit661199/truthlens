import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("✓ Database Connected"));
  mongoose.connection.on("disconnected", () => console.log("✗ Database Disconnected"));
  mongoose.connection.on("error", (error) => {
    console.error("✗ Database Error:", error.message);
  });

  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });  
  } catch (error) {
    console.warn("⚠ MongoDB Connection Failed (app will continue):", error.message);
    // Don't throw - let app continue
  }
};

export default connectDB;