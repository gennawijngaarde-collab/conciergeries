import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type PricingListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function usePricing() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['pricing'],
    queryFn: () =>
      api.get<PricingListResponse>('/api/v1/pricing', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
