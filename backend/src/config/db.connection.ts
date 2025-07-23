import mongoose, { connect } from "mongoose";

const dbConnect = async () => {
  const mongoUrl = process.env.MONGO_URL;

  try {
    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined in the environment variables");
    }

    await connect(mongoUrl)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        console.error("Error while connecting to MongoDB:", err);
      });
  } catch (error) {
    console.log("error when connecting DB...!");
  }
};

export default dbConnect
