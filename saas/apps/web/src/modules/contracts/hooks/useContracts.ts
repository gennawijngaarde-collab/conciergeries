import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type ContractsListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function useContracts() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['contracts'],
    queryFn: () =>
      api.get<ContractsListResponse>('/api/v1/contracts', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
