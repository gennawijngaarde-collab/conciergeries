import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type ReportsListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function useReports() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['reports'],
    queryFn: () =>
      api.get<ReportsListResponse>('/api/v1/reports', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
