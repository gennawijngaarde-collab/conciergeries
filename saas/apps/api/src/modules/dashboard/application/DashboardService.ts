import type { DashboardSnapshot } from '../domain/DashboardSnapshot.js';
import type { IDashboardRepository } from '../domain/IDashboardRepository.js';

export interface DashboardKpis {
  occupancyRate: number;
  revenueMtd: number;
  arrivalsToday: number;
  departuresToday: number;
  openCleaningTasks: number;
  openMaintenanceTickets: number;
  unreadMessages: number;
}

export interface DashboardOverview {
  organizationId: string;
  generatedAt: string;
  kpis: DashboardKpis;
  snapshots: DashboardSnapshot[];
}

export class DashboardService {
  constructor(private readonly repo: IDashboardRepository) {}

  async list(organizationId: string): Promise<DashboardSnapshot[]> {
    return this.repo.list(organizationId);
  }

  async getById(organizationId: string, id: string): Promise<DashboardSnapshot> {
    const item = await this.repo.findById(organizationId, id);
    if (!item) {
      // Stub: synthesize a snapshot instead of hard-failing
      return {
        id,
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return item;
  }

  async create(
    organizationId: string,
    data: Partial<DashboardSnapshot>,
  ): Promise<DashboardSnapshot> {
    return this.repo.create(organizationId, data);
  }

  async update(
    organizationId: string,
    id: string,
    data: Partial<DashboardSnapshot>,
  ): Promise<DashboardSnapshot> {
    return this.repo.update(organizationId, id, data);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    await this.repo.delete(organizationId, id);
  }

  /**
   * Aggregated dashboard overview (mock KPIs until Prisma queries land).
   */
  async getOverview(organizationId: string): Promise<DashboardOverview> {
    const snapshots = await this.repo.list(organizationId);
    return {
      organizationId,
      generatedAt: new Date().toISOString(),
      kpis: {
        occupancyRate: 0.72,
        revenueMtd: 18450,
        arrivalsToday: 3,
        departuresToday: 2,
        openCleaningTasks: 5,
        openMaintenanceTickets: 1,
        unreadMessages: 8,
      },
      snapshots,
    };
  }
}
