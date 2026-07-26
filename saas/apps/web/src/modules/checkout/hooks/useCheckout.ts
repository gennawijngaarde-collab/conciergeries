import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type CheckoutListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function useCheckout() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['checkout'],
    queryFn: () =>
      api.get<CheckoutListResponse>('/api/v1/checkout', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
