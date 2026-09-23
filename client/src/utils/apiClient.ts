/**
 * Centralized API Client & HTTP Status Code Handler
 * Enforces precise HTTP status code handling across frontend API requests.
 */

export interface ApiResponse<T = any> {
  data?: T;
  statusCode: number;
  error?: string;
  message?: string;
}

/**
 * Executes fetch requests with explicit HTTP status code inspection.
 */
export async function apiFetch<T = any>(
  url: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const statusCode = response.status;

    // HTTP 204 No Content
    if (statusCode === 204) {
      return { statusCode, data: undefined };
    }

    let payload: any = {};
    try {
      payload = await response.json();
    } catch {
      payload = {};
    }

    // Inspect HTTP status codes
    switch (statusCode) {
      case 200: // OK
      case 201: // Created
      case 202: // Accepted
        return { statusCode, data: payload };

      case 400: // Bad Request
        return {
          statusCode,
          error: 'Bad Request (400)',
          message: payload.message || 'Invalid parameters supplied.',
        };

      case 401: // Unauthorized
        return {
          statusCode,
          error: 'Unauthorized (401)',
          message: payload.message || 'Authentication session expired or missing.',
        };

      case 403: // Forbidden
        return {
          statusCode,
          error: 'Forbidden (403)',
          message: payload.message || 'Access denied for this resource.',
        };

      case 404: // Not Found
        return {
          statusCode,
          error: 'Not Found (404)',
          message: payload.message || 'Requested resource could not be found.',
        };

      case 409: // Conflict
        return {
          statusCode,
          error: 'Conflict (409)',
          message: payload.message || 'Resource conflict (e.g., duplicate entry).',
        };

      case 422: // Unprocessable Entity
        return {
          statusCode,
          error: 'Unprocessable Entity (422)',
          message: payload.message || 'Validation failed for request entity.',
        };

      case 500: // Internal Server Error
        return {
          statusCode,
          error: 'Internal Server Error (500)',
          message: payload.message || 'An operational error occurred on the server.',
        };

      case 503: // Service Unavailable
        return {
          statusCode,
          error: 'Service Unavailable (503)',
          message: payload.message || 'External service or database temporarily unavailable.',
        };

      default:
        return {
          statusCode,
          error: `HTTP Error ${statusCode}`,
          message: payload.message || 'An unexpected HTTP status code was returned.',
        };
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      error: 'Network Error',
      message: error.message || 'Failed to establish connection to server.',
    };
  }
}
