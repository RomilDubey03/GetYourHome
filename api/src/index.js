import app from "./app.js";
const PORT = process.env.PORT || 3000;

// Only start server in non-production (Vercel handles production)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`⚙️  Server is running on port: ${PORT}`);
  });
}

// Export for Vercel
export default app;
