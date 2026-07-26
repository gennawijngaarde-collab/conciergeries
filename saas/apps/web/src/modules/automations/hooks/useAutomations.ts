import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type AutomationsListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function useAutomations() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['automations'],
    queryFn: () =>
      api.get<AutomationsListResponse>('/api/v1/automations', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
