import { AppError } from '../../../shared/errors/AppError.js';
import type {
  CalendarBlockEvent,
  CalendarBlockInput,
  CalendarEvent,
  CalendarListFilters,
} from '../domain/CalendarEvent.js';
import type { ICalendarRepository } from '../domain/ICalendarRepository.js';

export class CalendarService {
  constructor(private readonly repo: ICalendarRepository) {}

  async listEvents(
    organizationId: string,
    filters?: CalendarListFilters,
  ): Promise<CalendarEvent[]> {
    return this.repo.listEvents(organizationId, filters);
  }

  async list(organizationId: string): Promise<CalendarEvent[]> {
    return this.repo.listEvents(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<CalendarEvent> {
    const item = await this.repo.findBlockById(organizationId, id);
    if (!item) throw AppError.notFound('CalendarBlock', id);
    return item;
  }

  async createBlock(
    organizationId: string,
    data: CalendarBlockInput,
  ): Promise<CalendarBlockEvent> {
    return this.repo.createBlock(organizationId, data);
  }

  async updateBlock(
    organizationId: string,
    id: string,
    data: Partial<CalendarBlockInput>,
  ): Promise<CalendarBlockEvent> {
    await this.getById(organizationId, id);
    return this.repo.updateBlock(organizationId, id, data);
  }

  async removeBlock(organizationId: string, id: string): Promise<void> {
    await this.getById(organizationId, id);
    await this.repo.deleteBlock(organizationId, id);
  }

  async create(organizationId: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return this.repo.create(organizationId, data);
  }

  async update(
    organizationId: string,
    id: string,
    data: Partial<CalendarEvent>,
  ): Promise<CalendarEvent> {
    await this.getById(organizationId, id);
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.removeBlock(organizationId, id);
  }
}
