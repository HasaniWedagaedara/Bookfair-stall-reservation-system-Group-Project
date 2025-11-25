import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(' Starting database seeding...');

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'sandali811@gmail.com' },
    update: {
      name: 'KHC Peiris',
      password: hashedPassword,
      mobileNumber: '+94771234567',
      businessName: 'Akura Publishers',
    },
    create: {
      email: 'sandali811@gmail.com',
      name: 'KHC Peiris',
      password: hashedPassword,
      role: 'user',
      mobileNumber: '+94771234567',
      businessName: 'Akura Publishers',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'stallreservation@gmail.com' },
    update: {
      name: 'ABC Perera',
      password: hashedPassword,
      mobileNumber: '+94779876543',
      businessName: 'Sarasavi Publishers',
    },
    create: {
      email: 'stallreservation@gmail.com',
      name: 'ABC Perera',
      password: hashedPassword,
      role: 'user',
      mobileNumber: '+94779876543',
      businessName: 'Sarasavi Publishers',
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bookfair.com' },
    update: {
      name: 'Admin User',
      password: hashedPassword,
      mobileNumber: '+94771111111',
    },
    create: {
      email: 'admin@bookfair.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
      mobileNumber: '+94771111111',
    },
  });

  console.log(' Created users:', { user1: user1.email, user2: user2.email, admin: adminUser.email });

  // Create Genres
  const fictionGenre = await prisma.genre.upsert({
    where: { name: 'Fiction' },
    update: {},
    create: {
      name: 'Fiction',
      description: 'Fictional stories and novels',
    },
  });

  const nonFictionGenre = await prisma.genre.upsert({
    where: { name: 'Non-Fiction' },
    update: {},
    create: {
      name: 'Non-Fiction',
      description: 'Educational and informative books',
    },
  });

  const childrenGenre = await prisma.genre.upsert({
    where: { name: 'Children' },
    update: {},
    create: {
      name: 'Children',
      description: "Children's books and educational materials",
    },
  });

  const comicsGenre = await prisma.genre.upsert({
    where: { name: 'Comics & Manga' },
    update: {},
    create: {
      name: 'Comics & Manga',
      description: 'Comic books and manga',
    },
  });

  console.log(' Created genres');

  // Create Stalls
  const stall1 = await prisma.stall.upsert({
    where: { name: 'A1' },
    update: {},
    create: {
      name: 'A1',
      size: 'Small',
      location: 'Zone A, Row 1',
      dimensions: '3m x 2m',
      status: 'AVAILABLE',
      features: 'Basic lighting, Power outlet',
      idealFor: 'Small publishers, Individual authors',
      price: 15000.0,
    },
  });

  const stall2 = await prisma.stall.upsert({
    where: { name: 'B2' },
    update: {},
    create: {
      name: 'B2',
      size: 'Medium',
      location: 'Zone B, Row 2',
      dimensions: '5m x 3m',
      status: 'AVAILABLE',
      features: 'Enhanced lighting, Multiple power outlets, Storage space',
      idealFor: 'Medium publishers, Book distributors',
      price: 25000.0,
    },
  });

  const stall3 = await prisma.stall.upsert({
    where: { name: 'C3' },
    update: {},
    create: {
      name: 'C3',
      size: 'Large',
      location: 'Zone C, Row 3',
      dimensions: '7m x 4m',
      status: 'AVAILABLE',
      features: 'Premium lighting, Multiple power outlets, Storage space, WiFi access',
      idealFor: 'Large publishers, Corporate exhibitors',
      price: 40000.0,
    },
  });

  const stall4 = await prisma.stall.upsert({
    where: { name: 'D4' },
    update: {},
    create: {
      name: 'D4',
      size: 'Small',
      location: 'Zone D, Row 4',
      dimensions: '3m x 2m',
      status: 'AVAILABLE',
      features: 'Basic lighting, Power outlet',
      idealFor: 'Small publishers, Individual authors',
      price: 15000.0,
    },
  });

  const stall5 = await prisma.stall.upsert({
    where: { name: 'E5' },
    update: {},
    create: {
      name: 'E5',
      size: 'Medium',
      location: 'Zone E, Row 5',
      dimensions: '5m x 3m',
      status: 'AVAILABLE',
      features: 'Enhanced lighting, Multiple power outlets, Storage space',
      idealFor: 'Medium publishers, Book distributors',
      price: 25000.0,
    },
  });

  console.log(' Created stalls');

  // Create Reservations
  // Check if reservations already exist to avoid duplicates
  const existingReservation1 = await prisma.reservation.findFirst({
    where: { userId: user1.id, stallId: stall1.id },
  });

  if (!existingReservation1) {
    const reservation1 = await prisma.reservation.create({
      data: {
        userId: user1.id,
        stallId: stall1.id,
        status: 'CONFIRMED',
        totalAmount: stall1.price,
        qrCode: `QR-${Date.now()}-${user1.id.substring(0, 8)}`,
      },
    });

    // Add genres to reservation
    await prisma.reservationGenre.createMany({
      data: [
        { reservationId: reservation1.id, genreId: fictionGenre.id },
        { reservationId: reservation1.id, genreId: childrenGenre.id },
      ],
    });

    // Update stall status
    await prisma.stall.update({
      where: { id: stall1.id },
      data: { status: 'RESERVED' },
    });

    console.log(' Created reservation 1 for', user1.email);
  }

  const existingReservation2 = await prisma.reservation.findFirst({
    where: { userId: user2.id, stallId: stall2.id },
  });

  if (!existingReservation2) {
    const reservation2 = await prisma.reservation.create({
      data: {
        userId: user2.id,
        stallId: stall2.id,
        status: 'CONFIRMED',
        totalAmount: stall2.price,
        qrCode: `QR-${Date.now()}-${user2.id.substring(0, 8)}`,
      },
    });

    // Add genres to reservation
    await prisma.reservationGenre.createMany({
      data: [
        { reservationId: reservation2.id, genreId: nonFictionGenre.id },
        { reservationId: reservation2.id, genreId: comicsGenre.id },
      ],
    });

    // Update stall status
    await prisma.stall.update({
      where: { id: stall2.id },
      data: { status: 'RESERVED' },
    });

    console.log(' Created reservation 2 for', user2.email);
  }

  console.log(' Seeding completed successfully!');
  console.log('\n Summary:');
  console.log('- Users: 3 (2 regular users + 1 admin)');
  console.log('- Genres: 4');
  console.log('- Stalls: 5');
  console.log('- Reservations: 2');
  console.log('\n Login Credentials:');
  console.log('Email: sandali811@gmail.com | Password: password123');
  console.log('Email: stallreservation@gmail.com | Password: password123');
  console.log('Email: admin@bookfair.com | Password: password123');
  console.log('\n View data at: http://localhost:5555 (Prisma Studio)');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
