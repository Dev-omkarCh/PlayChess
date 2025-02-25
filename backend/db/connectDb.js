import mongoose from "mongoose";

const connectDb = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Connected To Database`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
};

export default connectDb;