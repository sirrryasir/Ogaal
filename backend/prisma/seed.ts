import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/config/prisma"; 

async function main() {
  const hashedPassword = bcrypt.hashSync("Ogaal@123", 10);

  await prisma.user.upsert({
    where: { email: "admin@ogaal.com" },
    update: {},
    create: {
      fullName: "Ogaal Admin",
      email: "admin@ogaal.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
