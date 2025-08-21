import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const red = await prisma.color.create({
    data: {
      name: "Red",
      code: "#FF0000",
    },
  });

  const blue = await prisma.color.create({
    data: {
      name: "Blue",
      code: "#0000FF",
    },
  });

  const product = await prisma.product.create({
    data: {
      title: "Product 1",
      price: 100,
      description: "Description 1",
      hasDiscount: false,
      images: {
        create: [
          {
            url: "https://imgs.search.brave.com/UszzEkcE-A0fs0U5dgAoFXYDCJf-BDGvhSV7cfWLoNs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/YXVkaW8tY3JlYXRp/b24vdmlzdWFscy1z/b25ncy53ZWJw",
          },
        ],
      },
      colors: { connect: [{ id: red.id }, { id: blue.id }] },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
