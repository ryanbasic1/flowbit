// API client utilities

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new ApiError(response.status, error.error || error.message || "API Error", error);
  }

  return response.json();
}

export const api = {
  // GET request
  get: <T>(endpoint: string): Promise<T> => {
    return fetcher<T>(`${API_BASE}${endpoint}`);
  },

  // POST request
  post: <T>(endpoint: string, data: any): Promise<T> => {
    return fetcher<T>(`${API_BASE}${endpoint}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // PUT request
  put: <T>(endpoint: string, data: any): Promise<T> => {
    return fetcher<T>(`${API_BASE}${endpoint}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // DELETE request
  delete: <T>(endpoint: string): Promise<T> => {
    return fetcher<T>(`${API_BASE}${endpoint}`, {
      method: "DELETE",
    });
  },
};

// Helper function to build query strings
export function buildQueryString(params: Record<string, any>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}
