import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type ChannelsListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function useChannels() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['channels'],
    queryFn: () =>
      api.get<ChannelsListResponse>('/api/v1/channels', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
