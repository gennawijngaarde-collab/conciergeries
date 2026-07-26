import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type InventoryListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function useInventory() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['inventory'],
    queryFn: () =>
      api.get<InventoryListResponse>('/api/v1/inventory', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
