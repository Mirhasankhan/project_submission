import { PrismaClient, UserRole } from "@prisma/client";
import config from "../src/config";
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash(
    config.mentor_password as string,
    Number(config.jwt.gen_salt),
  );

  await prisma.user.upsert({
    where: { email: config.default_mentor_email },
    update: {},
    create: {
      email: config.default_mentor_email as string,
      fullName: "Mentor",
      password: hashedPassword,
      role: UserRole.Mentor,    
    },
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
