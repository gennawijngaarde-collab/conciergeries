import type { Reservation } from './Reservation.js';

export interface IReservationRepository {
  findById(organizationId: string, id: string): Promise<Reservation | null>;
  list(organizationId: string): Promise<Reservation[]>;
  create(organizationId: string, data: Partial<Reservation>): Promise<Reservation>;
  update(organizationId: string, id: string, data: Partial<Reservation>): Promise<Reservation>;
  delete(organizationId: string, id: string): Promise<void>;
}
