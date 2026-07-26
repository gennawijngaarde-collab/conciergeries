import { useQuery } from '@tanstack/react-query';
import { api, normalizeList } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';

export type Property = {
  id: string;
  name?: string;
  city?: string | null;
  capacity?: number;
  bedrooms?: number;
  bathrooms?: number;
  basePrice?: number | string;
  checkInTime?: string;
  checkOutTime?: string;
  propertyType?: string | null;
  description?: string | null;
  addressLine1?: string | null;
  postalCode?: string | null;
  country?: string | null;
  [key: string]: unknown;
};

export type PropertiesListResponse = {
  items: Property[];
  meta?: { total?: number };
};

export function useProperties() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const data = await api.get<Property[] | { items?: Property[] }>('/api/v1/properties', {
        token: accessToken,
      });
      const items = normalizeList(data);
      return { items, meta: { total: items.length } } satisfies PropertiesListResponse;
    },
    enabled: Boolean(accessToken),
    retry: false,
  });
}
