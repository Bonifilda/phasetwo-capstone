// Base API client for making HTTP requests

import { ApiResponse } from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, any>
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    
    if (isJson) {
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorData.message || errorMessage
      } catch (e) {
        // If JSON parsing fails, use default error message
      }
    }

    throw new ApiError(errorMessage, response.status)
  }

  if (isJson) {
    return response.json()
  }

  return response.text() as any
}

function buildUrl(endpoint: string, params?: Record<string, any>): string {
  // Handle relative base URLs (like '/api') vs absolute URLs
  let url: URL
  
  if (API_BASE_URL.startsWith('http')) {
    // Absolute URL - use URL constructor
    url = new URL(endpoint, API_BASE_URL)
  } else {
    // Relative URL - construct manually
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    url = new URL(`${baseUrl}${cleanEndpoint}`, window.location.origin)
  }
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
}

export const apiClient = {
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = buildUrl(endpoint, options?.params)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    return handleResponse<T>(response)
  },

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const url = buildUrl(endpoint, options?.params)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })

    return handleResponse<T>(response)
  },

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const url = buildUrl(endpoint, options?.params)
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })

    return handleResponse<T>(response)
  },

  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const url = buildUrl(endpoint, options?.params)
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })

    return handleResponse<T>(response)
  },

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = buildUrl(endpoint, options?.params)
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    return handleResponse<T>(response)
  },

  async upload<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T> {
    const url = buildUrl(endpoint, options?.params)
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      ...options,
      // Don't set Content-Type header for FormData - browser will set it with boundary
      headers: {
        ...options?.headers,
      },
    })

    return handleResponse<T>(response)
  },
}

// Helper function to handle API errors consistently
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}
