import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type DashboardListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function useDashboard() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () =>
      api.get<DashboardListResponse>('/api/v1/dashboard', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
