import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, normalizeList } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type CalendarEvent = {
  id: string;
  propertyId?: string;
  property?: { id?: string; name?: string };
  type?: string;
  title?: string;
  notes?: string | null;
  startDate?: string;
  endDate?: string;
  start?: string;
  end?: string;
  [key: string]: unknown;
};

export type CalendarListResponse = {
  items: CalendarEvent[];
  meta?: { total?: number };
};

export function useCalendar() {
  const { accessToken } = useAuth();
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ['calendar'],
    queryFn: async () => {
      try {
        const data = await api.get<CalendarEvent[] | { items?: CalendarEvent[] }>(
          '/api/v1/calendar/events',
          { token: accessToken },
        );
        const items = normalizeList(data);
        return { items, meta: { total: items.length } } satisfies CalendarListResponse;
      } catch {
        const data = await api.get<CalendarEvent[] | { items?: CalendarEvent[] }>(
          '/api/v1/calendar',
          { token: accessToken },
        );
        const items = normalizeList(data);
        return { items, meta: { total: items.length } } satisfies CalendarListResponse;
      }
    },
    enabled: Boolean(accessToken),
    retry: false,
  });

  const create = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.post<CalendarEvent>('/api/v1/calendar', body, { token: accessToken }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['calendar'] }),
  });

  return { ...list, create };
}
