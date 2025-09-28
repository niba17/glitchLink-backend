import app from "./app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Render akan kasih PORT via env, fallback ke 3000 untuk local
const PORT = parseInt(process.env.PORT || "3000", 10);

async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");

    // Gunakan 0.0.0.0 supaya bisa listen di cloud
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "❌ Failed to connect to the database or start server:",
      error
    );
    process.exit(1);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
