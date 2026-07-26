import { AppError } from '../../../shared/errors/AppError.js';
import type { Reservation } from '../domain/Reservation.js';
import type { IReservationRepository } from '../domain/IReservationRepository.js';

export class ReservationService {
  constructor(private readonly repo: IReservationRepository) {}

  async list(organizationId: string): Promise<Reservation[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<Reservation> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) throw AppError.notFound('Reservation', id);
    return item;
  }

  async create(organizationId: string, data: Partial<Reservation>): Promise<Reservation> {
    return this.repo.create(organizationId, data);
  }

  async update(organizationId: string, id: string, data: Partial<Reservation>): Promise<Reservation> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.delete(organizationId, id);
  }
}
