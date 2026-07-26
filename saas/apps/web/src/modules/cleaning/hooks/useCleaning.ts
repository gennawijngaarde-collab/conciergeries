import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, normalizeList } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type CleaningTaskStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'INSPECTED'
  | 'FAILED'
  | 'CANCELLED';

export type CleaningTask = {
  id: string;
  propertyId?: string;
  property?: { id?: string; name?: string };
  status?: CleaningTaskStatus | string;
  scheduledAt?: string | null;
  notes?: string | null;
  [key: string]: unknown;
};

export type CleaningListResponse = {
  items: CleaningTask[];
  meta?: { total?: number };
};

export function useCleaning() {
  const { accessToken } = useAuth();
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ['cleaning'],
    queryFn: async () => {
      const data = await api.get<CleaningTask[] | { items?: CleaningTask[] }>(
        '/api/v1/cleaning',
        { token: accessToken },
      );
      const items = normalizeList(data);
      return { items, meta: { total: items.length } } satisfies CleaningListResponse;
    },
    enabled: Boolean(accessToken),
    retry: false,
  });

  const create = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.post<CleaningTask>('/api/v1/cleaning', body, { token: accessToken }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['cleaning'] }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: CleaningTaskStatus }) =>
      api.patch<CleaningTask>(`/api/v1/cleaning/${id}`, { status }, { token: accessToken }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['cleaning'] }),
  });

  return { ...list, create, updateStatus };
}
