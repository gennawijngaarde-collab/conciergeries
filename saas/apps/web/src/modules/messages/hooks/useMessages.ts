import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type MessagesListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function useMessages() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['messages'],
    queryFn: () =>
      api.get<MessagesListResponse>('/api/v1/messages', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
