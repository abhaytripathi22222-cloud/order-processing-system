import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.inventory.createMany({
    data: [
      {
        sku: "LAPTOP",
        quantity: 20,
      },
      {
        sku: "MOBILE",
        quantity: 10,
      },
      {
        sku: "HEADPHONE",
        quantity: 50,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Inventory Seeded");
}

main()
  .finally(() => prisma.$disconnect());