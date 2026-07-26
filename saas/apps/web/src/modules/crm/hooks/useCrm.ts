import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type CrmListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function useCrm() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['crm'],
    queryFn: () =>
      api.get<CrmListResponse>('/api/v1/crm', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
