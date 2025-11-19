import { ErrorResponse } from "@/types/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public detail?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("access_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/signup")) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json().catch(() => ({
      message: "network_error",
      detail: "Failed to parse error response",
    }));

    throw new ApiError(response.status, error.message, error.detail);
  }

  return response.json();
}
