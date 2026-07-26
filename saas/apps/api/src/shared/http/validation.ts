import { z, type ZodSchema } from 'zod';
import { AppError } from '../errors/AppError.js';

export function parseBody<T>(schema: ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw AppError.validation('Validation failed', result.error.flatten());
  }
  return result.data;
}

export const propertyCreateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional().nullable(),
  description: z.string().optional().nullable(),
  propertyType: z.string().optional().nullable(),
  addressLine1: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  capacity: z.coerce.number().int().positive().optional(),
  bedrooms: z.coerce.number().int().nonnegative().optional(),
  bathrooms: z.coerce.number().nonnegative().optional(),
  basePrice: z.coerce.number().nonnegative().optional(),
  currency: z.string().optional(),
  touristTax: z.coerce.number().nonnegative().optional().nullable(),
  deposit: z.coerce.number().nonnegative().optional().nullable(),
  cleaningFee: z.coerce.number().nonnegative().optional().nullable(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  houseRules: z.string().optional().nullable(),
  digitalGuide: z.record(z.unknown()).optional().nullable(),
  amenitiesNotes: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export const propertyUpdateSchema = propertyCreateSchema.partial();

export const reservationCreateSchema = z.object({
  propertyId: z.string().min(1),
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),
  status: z
    .enum([
      'INQUIRY',
      'PENDING',
      'CONFIRMED',
      'CHECKED_IN',
      'CHECKED_OUT',
      'CANCELLED',
      'NO_SHOW',
      'BLOCKED',
    ])
    .optional(),
  channel: z
    .enum([
      'AIRBNB',
      'BOOKING',
      'VRBO',
      'EXPEDIA',
      'GOOGLE',
      'ABRITEL',
      'DIRECT',
      'OTHER',
    ])
    .optional(),
  confirmationCode: z.string().optional().nullable(),
  adults: z.coerce.number().int().positive().optional(),
  children: z.coerce.number().int().nonnegative().optional(),
  currency: z.string().optional(),
  nightlyRate: z.coerce.number().nonnegative().optional().nullable(),
  nightsCount: z.coerce.number().int().nonnegative().optional().nullable(),
  totalAmount: z.coerce.number().nonnegative().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const reservationUpdateSchema = reservationCreateSchema.partial();

export const calendarBlockCreateSchema = z.object({
  propertyId: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  reason: z
    .enum([
      'OWNER_STAY',
      'MAINTENANCE',
      'PREPARATION',
      'SEASONAL_CLOSE',
      'MANUAL',
      'EXTERNAL',
      'OTHER',
    ])
    .optional(),
  notes: z.string().optional().nullable(),
});

export const calendarBlockUpdateSchema = calendarBlockCreateSchema.partial();

export const cleaningCreateSchema = z.object({
  propertyId: z.string().min(1),
  reservationId: z.string().optional().nullable(),
  status: z
    .enum([
      'PENDING',
      'ASSIGNED',
      'IN_PROGRESS',
      'COMPLETED',
      'INSPECTED',
      'FAILED',
      'CANCELLED',
    ])
    .optional(),
  scheduledAt: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const cleaningUpdateSchema = cleaningCreateSchema.partial();

export const cleaningStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'ASSIGNED',
    'IN_PROGRESS',
    'COMPLETED',
    'INSPECTED',
    'FAILED',
    'CANCELLED',
  ]),
});
