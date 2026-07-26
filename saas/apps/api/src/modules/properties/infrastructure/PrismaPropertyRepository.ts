import { Prisma } from '@prisma/client';
import { prisma } from '../../../infrastructure/prisma/client.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { serializeProperty, slugify } from '../../../shared/http/serialize.js';
import type { Property } from '../domain/Property.js';
import type { IPropertyRepository } from '../domain/IPropertyRepository.js';

function optionalDecimal(v: unknown): number | undefined {
  if (v === undefined || v === null || v === '') return undefined;
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) throw AppError.validation('Invalid decimal value');
  return n;
}

function parseCreateBody(data: Partial<Property> & Record<string, unknown>) {
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (!name) throw AppError.validation('name is required');

  const slug =
    typeof data.slug === 'string' && data.slug.trim()
      ? data.slug.trim()
      : slugify(name);

  return {
    name,
    slug,
    description: (data.description as string | null | undefined) ?? null,
    propertyType: (data.propertyType as string | null | undefined) ?? null,
    addressLine1: (data.addressLine1 as string | null | undefined) ?? null,
    city: (data.city as string | null | undefined) ?? null,
    postalCode: (data.postalCode as string | null | undefined) ?? null,
    country: (data.country as string | undefined) ?? 'FR',
    latitude: optionalDecimal(data.latitude) ?? null,
    longitude: optionalDecimal(data.longitude) ?? null,
    capacity: typeof data.capacity === 'number' ? data.capacity : 2,
    bedrooms: typeof data.bedrooms === 'number' ? data.bedrooms : 1,
    bathrooms: optionalDecimal(data.bathrooms) ?? 1,
    basePrice: optionalDecimal(data.basePrice) ?? 0,
    currency: (data.currency as string | undefined) ?? 'EUR',
    touristTax: optionalDecimal(data.touristTax) ?? null,
    deposit: optionalDecimal(data.deposit) ?? null,
    cleaningFee: optionalDecimal(data.cleaningFee) ?? null,
    checkInTime: (data.checkInTime as string | undefined) ?? '16:00',
    checkOutTime: (data.checkOutTime as string | undefined) ?? '11:00',
    houseRules: (data.houseRules as string | null | undefined) ?? null,
    digitalGuide:
      data.digitalGuide === undefined || data.digitalGuide === null
        ? Prisma.JsonNull
        : (data.digitalGuide as Prisma.InputJsonValue),
    amenitiesNotes: (data.amenitiesNotes as string | null | undefined) ?? null,
    isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
    isPublished: typeof data.isPublished === 'boolean' ? data.isPublished : false,
  };
}

function parseUpdateBody(data: Partial<Property> & Record<string, unknown>) {
  const patch: Prisma.PropertyUpdateInput = {};

  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || !data.name.trim()) {
      throw AppError.validation('name must be a non-empty string');
    }
    patch.name = data.name.trim();
  }
  if (data.slug !== undefined) patch.slug = data.slug as string | null;
  if (data.description !== undefined) patch.description = data.description as string | null;
  if (data.propertyType !== undefined) patch.propertyType = data.propertyType as string | null;
  if (data.addressLine1 !== undefined) patch.addressLine1 = data.addressLine1 as string | null;
  if (data.city !== undefined) patch.city = data.city as string | null;
  if (data.postalCode !== undefined) patch.postalCode = data.postalCode as string | null;
  if (data.country !== undefined) patch.country = data.country as string;
  if (data.latitude !== undefined) patch.latitude = optionalDecimal(data.latitude) ?? null;
  if (data.longitude !== undefined) patch.longitude = optionalDecimal(data.longitude) ?? null;
  if (data.capacity !== undefined) patch.capacity = data.capacity as number;
  if (data.bedrooms !== undefined) patch.bedrooms = data.bedrooms as number;
  if (data.bathrooms !== undefined) patch.bathrooms = optionalDecimal(data.bathrooms);
  if (data.basePrice !== undefined) patch.basePrice = optionalDecimal(data.basePrice);
  if (data.currency !== undefined) patch.currency = data.currency as string;
  if (data.touristTax !== undefined) patch.touristTax = optionalDecimal(data.touristTax) ?? null;
  if (data.deposit !== undefined) patch.deposit = optionalDecimal(data.deposit) ?? null;
  if (data.cleaningFee !== undefined) patch.cleaningFee = optionalDecimal(data.cleaningFee) ?? null;
  if (data.checkInTime !== undefined) patch.checkInTime = data.checkInTime as string;
  if (data.checkOutTime !== undefined) patch.checkOutTime = data.checkOutTime as string;
  if (data.houseRules !== undefined) patch.houseRules = data.houseRules as string | null;
  if (data.digitalGuide !== undefined) {
    patch.digitalGuide =
      data.digitalGuide === null
        ? Prisma.JsonNull
        : (data.digitalGuide as Prisma.InputJsonValue);
  }
  if (data.amenitiesNotes !== undefined) {
    patch.amenitiesNotes = data.amenitiesNotes as string | null;
  }
  if (data.isActive !== undefined) patch.isActive = data.isActive as boolean;
  if (data.isPublished !== undefined) patch.isPublished = data.isPublished as boolean;

  return patch;
}

export class PrismaPropertyRepository implements IPropertyRepository {
  async findById(organizationId: string, id: string): Promise<Property | null> {
    const row = await prisma.property.findFirst({
      where: { id, organizationId },
    });
    return row ? serializeProperty(row) : null;
  }

  async list(organizationId: string): Promise<Property[]> {
    const rows = await prisma.property.findMany({
      where: { organizationId },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(serializeProperty);
  }

  async create(organizationId: string, data: Partial<Property>): Promise<Property> {
    const body = parseCreateBody(data as Partial<Property> & Record<string, unknown>);
    const row = await prisma.property.create({
      data: {
        organizationId,
        ...body,
      },
    });
    return serializeProperty(row);
  }

  async update(
    organizationId: string,
    id: string,
    data: Partial<Property>,
  ): Promise<Property> {
    const existing = await prisma.property.findFirst({
      where: { id, organizationId },
    });
    if (!existing) throw AppError.notFound('Property', id);

    const row = await prisma.property.update({
      where: { id },
      data: parseUpdateBody(data as Partial<Property> & Record<string, unknown>),
    });
    return serializeProperty(row);
  }

  async delete(organizationId: string, id: string): Promise<void> {
    const existing = await prisma.property.findFirst({
      where: { id, organizationId },
    });
    if (!existing) throw AppError.notFound('Property', id);
    await prisma.property.delete({ where: { id } });
  }
}
