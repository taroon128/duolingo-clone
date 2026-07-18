/**
 * Axios client — Task 19.
 *
 * The SINGLE import point for every HTTP call this frontend makes.
 * All API service functions below use this instance, not a raw
 * `fetch` or a separately-created axios instance, so:
 *   - Base URL comes from one env var (NEXT_PUBLIC_API_URL) in one place
 *   - Request/response interceptors, auth headers, and error handling
 *     can be added here once and apply everywhere
 *   - Changing the backend address for production is one line in
 *     the deployment environment, not a find-replace across files
 *
 * NEXT_PUBLIC_ prefix: Next.js only exposes env vars to the browser
 * if they start with NEXT_PUBLIC_. Without it, the variable is
 * undefined on the client side even if it's set in .env.local.
 * Our API client is imported by both Server and Client Components,
 * so the public prefix is required here.
 */
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,       // 10 seconds — fail fast on a hung backend
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor: standardize all API errors into a single
 * ApiError shape with a human-readable `message` field, so callers
 * don't need to branch on AxiosError vs NetworkError vs TimeoutError
 * to show the user something useful.
 *
 * Keeping this in the Axios layer rather than scattered across
 * individual service functions means adding auth token refresh
 * or global error logging here later touches every endpoint at once.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const detail = error.response?.data?.detail;

      // FastAPI sends {"detail": "..."} for HTTP errors — prefer that
      // message if available, otherwise fall back to generic ones.
      const message =
        typeof detail === "string"
          ? detail
          : status === 404
          ? "Not found"
          : status === 403
          ? "Access denied — check your hearts"
          : status === 422
          ? "Invalid request"
          : status === 500
          ? "Server error — try again"
          : error.message;

      return Promise.reject(new ApiError(message, status));
    }

    // Network error / timeout — no response at all
    return Promise.reject(new ApiError("Network error — is the backend running?"));
  }
);

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}
