import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type CheckinListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function useCheckin() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['checkin'],
    queryFn: () =>
      api.get<CheckinListResponse>('/api/v1/checkin', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
