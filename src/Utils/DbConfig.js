import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const DB_URL = process.env.CLOUD_DB_URL_TEST;
        await mongoose.connect(DB_URL);
        console.log('MongoDB Connected ✅');
    } catch (error) {
        console.error('DB Error:', error.message);
        process.exit(1);
    }
};

export default connectDb;