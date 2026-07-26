import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, normalizeList } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type Reservation = {
  id: string;
  propertyId?: string;
  property?: { id?: string; name?: string };
  checkInDate?: string;
  checkOutDate?: string;
  checkIn?: string;
  checkOut?: string;
  status?: string;
  channel?: string;
  adults?: number;
  totalAmount?: number | string;
  total?: number | string;
  [key: string]: unknown;
};

export type ReservationsListResponse = {
  items: Reservation[];
  meta?: { total?: number };
};

export function useReservations() {
  const { accessToken } = useAuth();
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const data = await api.get<Reservation[] | { items?: Reservation[] }>(
        '/api/v1/reservations',
        { token: accessToken },
      );
      const items = normalizeList(data);
      return { items, meta: { total: items.length } } satisfies ReservationsListResponse;
    },
    enabled: Boolean(accessToken),
    retry: false,
  });

  const create = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.post<Reservation>('/api/v1/reservations', body, { token: accessToken }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['reservations'] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/api/v1/reservations/${id}`, { token: accessToken }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['reservations'] }),
  });

  return { ...list, create, remove };
}
