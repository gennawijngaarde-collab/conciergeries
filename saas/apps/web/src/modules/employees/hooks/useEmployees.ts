import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type EmployeesListResponse = {
  items: unknown[];
  meta?: { total?: number };
};

export function useEmployees() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['employees'],
    queryFn: () =>
      api.get<EmployeesListResponse>('/api/v1/employees', { token: accessToken }),
    retry: false,
    placeholderData: { items: [], meta: { total: 0 } },
  });
}
