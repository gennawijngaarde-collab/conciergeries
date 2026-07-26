import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type MaintenanceListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function useMaintenance() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['maintenance'],
    queryFn: () =>
      api.get<MaintenanceListResponse>('/api/v1/maintenance', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
