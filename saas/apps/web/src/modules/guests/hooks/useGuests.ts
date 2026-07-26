import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type GuestsListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function useGuests() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['guests'],
    queryFn: () =>
      api.get<GuestsListResponse>('/api/v1/guests', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
