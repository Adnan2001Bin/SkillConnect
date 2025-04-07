import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );

    console.log(
      // Log a message if the connection is successful
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}` // Display the host of the connected database
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error); // Log the error message
    process.exit(1); // Exit the process with failure code
  }
};

export default connectDB;
