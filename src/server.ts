// src/server.ts
import app from "./app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database or start server:", error);
    process.exit(1);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});

// import app from "./app";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// // parseInt agar pasti number
// const PORT = parseInt(process.env.PORT || "80", 10);

// async function main() {
//   try {
//     await prisma.$connect();
//     console.log("Database connected successfully!");

//     app.listen(PORT, "0.0.0.0", () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("Failed to connect to the database or start server:", error);
//     process.exit(1);
//   }
// }

// main().finally(async () => {
//   await prisma.$disconnect();
// });
