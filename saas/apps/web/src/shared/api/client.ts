const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  token?: string | null;
  organizationId?: string | null;
};

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: { code?: string; message?: string; details?: unknown };
};

function readOrgId(explicit?: string | null): string | null {
  if (explicit) return explicit;
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('pms_org_id');
    if (stored) return stored;
  }
  return import.meta.env.VITE_DEV_ORG_ID || null;
}

function extractErrorMessage(data: unknown, status: number): string {
  if (typeof data === 'object' && data) {
    const envelope = data as ApiEnvelope<unknown>;
    if (envelope.error?.message) return String(envelope.error.message);
    if ('message' in data && (data as { message: unknown }).message != null) {
      return String((data as { message: unknown }).message);
    }
  }
  return `Request failed (${status})`;
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, token, organizationId, headers, ...rest } = options;
  const url = path.startsWith('http')
    ? path
    : `${API_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

  const orgId = readOrgId(organizationId);

  const res = await fetch(url, {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(orgId ? { 'x-organization-id': orgId } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (
    typeof data === 'object' &&
    data &&
    'success' in data &&
    ('data' in data || 'error' in data)
  ) {
    const envelope = data as ApiEnvelope<T>;
    if (!res.ok || envelope.success === false) {
      throw new ApiError(extractErrorMessage(data, res.status), res.status, data);
    }
    return envelope.data as T;
  }

  if (!res.ok) {
    throw new ApiError(extractErrorMessage(data, res.status), res.status, data);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) =>
    apiClient<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    apiClient<T>(path, { ...opts, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    apiClient<T>(path, { ...opts, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    apiClient<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T>(path: string, opts?: RequestOptions) =>
    apiClient<T>(path, { ...opts, method: 'DELETE' }),
};

/** Normalize list payloads that may be a bare array or `{ items }`. */
export function normalizeList<T>(data: T[] | { items?: T[] } | null | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.items ?? [];
}
