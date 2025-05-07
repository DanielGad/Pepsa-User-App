// src/context/ApiContext.tsx
import { createContext, useContext, ReactNode } from "react";

interface ApiContextType {
  get: <T>(endpoint: string) => Promise<T>;
  post: <T>(endpoint: string, data: unknown) => Promise<T>;
  put: <T>(endpoint: string, data: unknown) => Promise<T>;
  del: (endpoint: string) => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const BASE_URL = "https://680ead7467c5abddd192c3df.mockapi.io/api";

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const request = async (method: string, endpoint: string, data?: unknown) => {
    const url = `${BASE_URL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      // For DELETE requests that might not return content
      if (method === 'DELETE' && response.status === 204) {
        return;
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  const get = async <T,>(endpoint: string): Promise<T> => {
    return request('GET', endpoint);
  };

  const post = async <T,>(endpoint: string, data: unknown): Promise<T> => {
    return request('POST', endpoint, data);
  };

  const put = async <T,>(endpoint: string, data: unknown): Promise<T> => {
    return request('PUT', endpoint, data);
  };

  const del = async (endpoint: string): Promise<void> => {
    return request('DELETE', endpoint);
  };

  return (
    <ApiContext.Provider value={{ get, post, put, del }}>
      {children}
    </ApiContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};