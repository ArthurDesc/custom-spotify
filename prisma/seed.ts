import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash('Password1293@', 12);

  await prisma.user.create({
    data: {
      email: 'arthur.descourvieres@gmail.com',
      hashedPassword,
    },
  });

  console.log('Seed complete: User created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 