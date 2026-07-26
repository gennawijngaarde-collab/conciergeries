import {
  BookingChannel,
  BookingStatus,
  CalendarBlockReason,
  CleaningTaskStatus,
  MemberStatus,
  RoleCode,
  PrismaClient,
} from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_ORG_ID = 'org_demo';

const ROLE_SEED: Array<{ code: RoleCode; name: string; description: string }> = [
  { code: RoleCode.SUPER_ADMIN, name: 'Super Admin', description: 'Platform admin' },
  { code: RoleCode.ENTERPRISE, name: 'Enterprise', description: 'Enterprise tenant admin' },
  { code: RoleCode.MANAGER, name: 'Manager', description: 'Conciergerie manager' },
  { code: RoleCode.RECEPTION, name: 'Reception', description: 'Front desk' },
  { code: RoleCode.CLEANING, name: 'Cleaning', description: 'Cleaning staff' },
  { code: RoleCode.MAINTENANCE, name: 'Maintenance', description: 'Maintenance staff' },
  { code: RoleCode.OWNER, name: 'Owner', description: 'Property owner' },
];

function startOfDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

async function main() {
  console.log('Seeding PMS demo data…');

  for (const role of ROLE_SEED) {
    await prisma.role.upsert({
      where: { code: role.code },
      create: role,
      update: { name: role.name, description: role.description },
    });
  }

  const managerRole = await prisma.role.findUniqueOrThrow({
    where: { code: RoleCode.MANAGER },
  });

  const org = await prisma.organization.upsert({
    where: { id: DEMO_ORG_ID },
    create: {
      id: DEMO_ORG_ID,
      name: 'Demo Conciergerie',
      slug: 'demo',
      email: 'hello@demo.cleanbnb.local',
      timezone: 'Europe/Paris',
      currency: 'EUR',
      locale: 'fr',
    },
    update: {
      name: 'Demo Conciergerie',
      slug: 'demo',
      isActive: true,
    },
  });

  const user = await prisma.user.upsert({
    where: { supabaseUserId: 'demo-user' },
    create: {
      supabaseUserId: 'demo-user',
      email: 'demo@cleanbnb.local',
      firstName: 'Demo',
      lastName: 'Manager',
      locale: 'fr',
    },
    update: {
      email: 'demo@cleanbnb.local',
      firstName: 'Demo',
      lastName: 'Manager',
      isActive: true,
    },
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: org.id,
        userId: user.id,
      },
    },
    create: {
      organizationId: org.id,
      userId: user.id,
      roleId: managerRole.id,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
    update: {
      roleId: managerRole.id,
      status: MemberStatus.ACTIVE,
    },
  });

  const propertyA = await prisma.property.upsert({
    where: {
      organizationId_slug: { organizationId: org.id, slug: 'appart-centre-saint-quentin' },
    },
    create: {
      organizationId: org.id,
      name: 'Appart Centre Saint-Quentin',
      slug: 'appart-centre-saint-quentin',
      description: 'Charmant T2 au cœur de Saint-Quentin, idéal week-end.',
      propertyType: 'apartment',
      addressLine1: '12 Rue de la Sellerie',
      city: 'Saint-Quentin',
      postalCode: '02100',
      country: 'FR',
      capacity: 4,
      bedrooms: 1,
      bathrooms: 1,
      basePrice: 89,
      cleaningFee: 45,
      deposit: 200,
      isActive: true,
      isPublished: true,
    },
    update: {
      name: 'Appart Centre Saint-Quentin',
      city: 'Saint-Quentin',
      isActive: true,
      isPublished: true,
    },
  });

  const propertyB = await prisma.property.upsert({
    where: {
      organizationId_slug: { organizationId: org.id, slug: 'maison-faubourg-saint-quentin' },
    },
    create: {
      organizationId: org.id,
      name: 'Maison Faubourg Saint-Quentin',
      slug: 'maison-faubourg-saint-quentin',
      description: 'Maison familiale avec jardin, proche gare.',
      propertyType: 'house',
      addressLine1: '8 Avenue Faidherbe',
      city: 'Saint-Quentin',
      postalCode: '02100',
      country: 'FR',
      capacity: 6,
      bedrooms: 3,
      bathrooms: 2,
      basePrice: 129,
      cleaningFee: 70,
      deposit: 350,
      isActive: true,
      isPublished: true,
    },
    update: {
      name: 'Maison Faubourg Saint-Quentin',
      city: 'Saint-Quentin',
      isActive: true,
      isPublished: true,
    },
  });

  const today = startOfDay(new Date());
  const weekCheckIn = addDays(today, -1);
  const weekCheckOut = addDays(today, 3);

  await prisma.reservation.deleteMany({
    where: {
      organizationId: org.id,
      confirmationCode: { in: ['DEMO-WEEK', 'DEMO-NEXT'] },
    },
  });

  const reservationWeek = await prisma.reservation.create({
    data: {
      organizationId: org.id,
      propertyId: propertyA.id,
      status: BookingStatus.CONFIRMED,
      channel: BookingChannel.AIRBNB,
      confirmationCode: 'DEMO-WEEK',
      checkInDate: weekCheckIn,
      checkOutDate: weekCheckOut,
      adults: 2,
      children: 0,
      currency: 'EUR',
      nightlyRate: 95,
      nightsCount: 4,
      totalAmount: 425,
      notes: 'Séjour démo semaine en cours',
    },
  });

  const reservationNext = await prisma.reservation.create({
    data: {
      organizationId: org.id,
      propertyId: propertyB.id,
      status: BookingStatus.PENDING,
      channel: BookingChannel.DIRECT,
      confirmationCode: 'DEMO-NEXT',
      checkInDate: addDays(today, 10),
      checkOutDate: addDays(today, 14),
      adults: 4,
      children: 1,
      currency: 'EUR',
      nightlyRate: 140,
      nightsCount: 4,
      totalAmount: 630,
      notes: 'Réservation démo à venir',
    },
  });

  await prisma.calendarBlock.deleteMany({
    where: { organizationId: org.id, notes: 'Demo owner stay' },
  });

  await prisma.calendarBlock.create({
    data: {
      organizationId: org.id,
      propertyId: propertyB.id,
      startDate: addDays(today, 20),
      endDate: addDays(today, 23),
      reason: CalendarBlockReason.OWNER_STAY,
      notes: 'Demo owner stay',
    },
  });

  await prisma.cleaningTask.deleteMany({
    where: {
      organizationId: org.id,
      notes: { in: ['Demo cleaning checkout', 'Demo cleaning prep'] },
    },
  });

  await prisma.cleaningTask.createMany({
    data: [
      {
        organizationId: org.id,
        propertyId: propertyA.id,
        reservationId: reservationWeek.id,
        status: CleaningTaskStatus.PENDING,
        scheduledAt: weekCheckOut,
        notes: 'Demo cleaning checkout',
      },
      {
        organizationId: org.id,
        propertyId: propertyB.id,
        reservationId: reservationNext.id,
        status: CleaningTaskStatus.ASSIGNED,
        scheduledAt: addDays(today, 9),
        notes: 'Demo cleaning prep',
      },
    ],
  });

  console.log('Seed complete:', {
    organizationId: org.id,
    user: user.email,
    properties: [propertyA.slug, propertyB.slug],
    reservations: [reservationWeek.confirmationCode, reservationNext.confirmationCode],
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
