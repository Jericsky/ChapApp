import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI as string);
        console.log(`MongoDB connected to: ${conn.connection.host}`)
    } catch (error) {
        console.log('MongoDB connection error: ', error);
    }
};