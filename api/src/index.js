import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectToDB from "./db/dbconnect.js";

const PORT = process.env.PORT || 3000;

// Initialize database connection
const startServer = async () => {
  try {
    await connectToDB();

    // Drop problematic unique index on saved field (one-time fix)
    try {
      const mongoose = await import("mongoose");
      await mongoose.connection.collection("users").dropIndex("saved_1");
      console.log("Dropped saved_1 index successfully");
    } catch (indexError) {
      // Index might not exist, which is fine
      if (indexError.code !== 27) {
        // 27 = index not found
        console.log("Index drop note:", indexError.message);
      }
    }

    // Only start server in non-production (Vercel handles production)
    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`⚙️  Server is running on port: ${PORT}`);
      });
    }
  } catch (error) {
    console.error("Server initialization failed:", error);
    process.exit(1);
  }
};

startServer();

// Export for Vercel
export default app;
