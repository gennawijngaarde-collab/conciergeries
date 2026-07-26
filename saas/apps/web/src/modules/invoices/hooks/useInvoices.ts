import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type InvoicesListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function useInvoices() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['invoices'],
    queryFn: () =>
      api.get<InvoicesListResponse>('/api/v1/invoices', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
