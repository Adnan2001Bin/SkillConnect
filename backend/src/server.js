import connectDB from "./db/index.js";
import app from "./app.js";

connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT || 5000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });

    server.on("error", (err) => {
      console.log(`❌ Server error: ${err.message}`);
    });
  })
  .catch((err) => {
    console.log("❌ MONGO DB connection failed !!!", err);
  });
