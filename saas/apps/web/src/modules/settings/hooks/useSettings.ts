import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type SettingsListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function useSettings() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['settings'],
    queryFn: () =>
      api.get<SettingsListResponse>('/api/v1/settings', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
