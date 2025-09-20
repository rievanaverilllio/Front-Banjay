const { PrismaClient, UserRole, UserStatus } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

async function main() {
  const users = [
    {
      email: "superadmin@banjay.local",
      name: "Super Admin",
      role: UserRole.ADMIN,
      password: "SuperAdmin123!",
    },
    {
      email: "admin1@banjay.local",
      name: "Admin 1",
      role: UserRole.ADMIN,
      password: "Admin123!",
    },
    {
      email: "admin2@banjay.local",
      name: "Admin 2",
      role: UserRole.ADMIN,
      password: "Admin123!",
    },
    {
      email: "admin3@banjay.local",
      name: "Admin 3",
      role: UserRole.ADMIN,
      password: "Admin123!",
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        role: u.role,
        status: UserStatus.ACTIVE,
        passwordHash: `sha256:${sha256(u.password)}`,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
