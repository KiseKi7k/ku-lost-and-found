import {prisma} from "./prisma"

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.claim.deleteMany();
  await prisma.lostItemImage.deleteMany();
  await prisma.record.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: "admin@ku.th",
      name: "Admin User",
      role: "admin",
      image: "https://i.pravatar.cc/150?img=1",
      emailVerified: new Date(),
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: "john.doe@ku.th",
      name: "John Doe",
      role: "user",
      image: "https://i.pravatar.cc/150?img=12",
      emailVerified: new Date(),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane.smith@ku.th",
      name: "Jane Smith",
      role: "user",
      image: "https://i.pravatar.cc/150?img=5",
      emailVerified: new Date(),
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: "bob.wilson@ku.th",
      name: "Bob Wilson",
      role: "user",
      image: "https://i.pravatar.cc/150?img=8",
      emailVerified: new Date(),
    },
  });

  console.log("✅ Created users");

  // Create records with images
  const record1 = await prisma.record.create({
    data: {
      itemName: "Blue Water Bottle",
      reporterId: admin.id,
      foundLocation: "Library 2nd Floor",
      foundAt: new Date("2024-12-20T10:30:00Z"),
      depositLocation: "Lost and Found Office - Building 1",
      claimed: false,
      image: {
        create: {
          imgUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
        },
      },
    },
  });

  const record2 = await prisma.record.create({
    data: {
      itemName: "Black Backpack",
      reporterId: user1.id,
      foundLocation: "Engineering Building Cafeteria",
      foundAt: new Date("2024-12-22T14:15:00Z"),
      depositLocation: "Lost and Found Office - Building 1",
      claimed: false,
      image: {
        create: {
          imgUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        },
      },
    },
  });

  const record3 = await prisma.record.create({
    data: {
      itemName: "Student ID Card",
      reporterId: user1.id,
      foundLocation: "Science Building Entrance",
      foundAt: new Date("2024-12-23T09:00:00Z"),
      depositLocation: "Lost and Found Office - Building 1",
      claimed: true,
      image: {
        create: {
          imgUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        },
      },
    },
  });

  const record4 = await prisma.record.create({
    data: {
      itemName: "Red Umbrella",
      reporterId: user2.id,
      foundLocation: "Bus Stop Near Main Gate",
      foundAt: new Date("2024-12-24T16:45:00Z"),
      depositLocation: "Lost and Found Office - Building 1",
      claimed: false,
      image: {
        create: {
          imgUrl: "https://images.unsplash.com/photo-1558486012-817176f84c6d?w=400",
        },
      },
    },
  });

  const record5 = await prisma.record.create({
    data: {
      itemName: "AirPods Case",
      reporterId: admin.id,
      foundLocation: "Computer Lab Room 302",
      foundAt: new Date("2024-12-25T11:20:00Z"),
      depositLocation: "Lost and Found Office - Building 1",
      claimed: false,
      image: {
        create: {
          imgUrl: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400",
        },
      },
    },
  });

  const record6 = await prisma.record.create({
    data: {
      itemName: "Textbook - Calculus II",
      reporterId: user2.id,
      foundLocation: "Classroom Building A, Room 201",
      foundAt: new Date("2024-12-26T13:00:00Z"),
      depositLocation: "Lost and Found Office - Building 1",
      claimed: true,
      image: {
        create: {
          imgUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        },
      },
    },
  });

  console.log("✅ Created records with images");

  // Create claims
  await prisma.claim.create({
    data: {
      recordId: record3.id,
      claimerId: user3.id,
    },
  });

  await prisma.claim.create({
    data: {
      recordId: record6.id,
      claimerId: user1.id,
    },
  });

  console.log("✅ Created claims");

  console.log("🎉 Seed completed successfully!");
  console.log(`
  📊 Summary:
  - Users: 4
  - Records: 6 (4 unclaimed, 2 claimed)
  - Images: 6
  - Claims: 2
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
