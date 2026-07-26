import type { Property } from '../domain/Property.js';
import type { IPropertyRepository } from '../domain/IPropertyRepository.js';
import { memoryStore, newId, type MemProperty } from '../../../infrastructure/memory/store.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { slugify } from '../../../shared/http/serialize.js';

function toProperty(p: MemProperty): Property {
  return {
    ...p,
    digitalGuide: (p.digitalGuide as Record<string, unknown> | null) ?? null,
  };
}

export class MemoryPropertyRepository implements IPropertyRepository {
  async findById(organizationId: string, id: string): Promise<Property | null> {
    const p = memoryStore().properties.find((x) => x.id === id && x.organizationId === organizationId);
    return p ? toProperty(p) : null;
  }

  async list(organizationId: string): Promise<Property[]> {
    return memoryStore()
      .properties.filter((p) => p.organizationId === organizationId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .map(toProperty);
  }

  async create(organizationId: string, data: Partial<Property>): Promise<Property> {
    if (!data.name?.trim()) throw AppError.validation('name is required');
    const now = new Date();
    const row: MemProperty = {
      id: newId('prop'),
      organizationId,
      name: data.name.trim(),
      slug: data.slug ?? slugify(data.name),
      description: data.description ?? null,
      propertyType: data.propertyType ?? 'apartment',
      addressLine1: data.addressLine1 ?? null,
      city: data.city ?? null,
      postalCode: data.postalCode ?? null,
      country: data.country ?? 'FR',
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      capacity: data.capacity ?? 2,
      bedrooms: data.bedrooms ?? 1,
      bathrooms: data.bathrooms ?? 1,
      basePrice: data.basePrice ?? 0,
      currency: data.currency ?? 'EUR',
      touristTax: data.touristTax ?? null,
      deposit: data.deposit ?? null,
      cleaningFee: data.cleaningFee ?? null,
      checkInTime: data.checkInTime ?? '16:00',
      checkOutTime: data.checkOutTime ?? '11:00',
      houseRules: data.houseRules ?? null,
      digitalGuide: data.digitalGuide ?? null,
      amenitiesNotes: data.amenitiesNotes ?? null,
      isActive: data.isActive ?? true,
      isPublished: data.isPublished ?? false,
      createdAt: now,
      updatedAt: now,
    };
    memoryStore().properties.push(row);
    return toProperty(row);
  }

  async update(organizationId: string, id: string, data: Partial<Property>): Promise<Property> {
    const idx = memoryStore().properties.findIndex((p) => p.id === id && p.organizationId === organizationId);
    if (idx < 0) throw AppError.notFound('Property', id);
    const prev = memoryStore().properties[idx]!;
    const next: MemProperty = {
      ...prev,
      ...data,
      id: prev.id,
      organizationId: prev.organizationId,
      digitalGuide: data.digitalGuide !== undefined ? data.digitalGuide : prev.digitalGuide,
      updatedAt: new Date(),
    };
    memoryStore().properties[idx] = next;
    return toProperty(next);
  }

  async delete(organizationId: string, id: string): Promise<void> {
    const store = memoryStore();
    store.properties = store.properties.filter((p) => !(p.id === id && p.organizationId === organizationId));
  }
}
