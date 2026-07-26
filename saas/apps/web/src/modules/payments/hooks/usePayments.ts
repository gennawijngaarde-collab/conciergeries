import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type PaymentsListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function usePayments() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['payments'],
    queryFn: () =>
      api.get<PaymentsListResponse>('/api/v1/payments', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
