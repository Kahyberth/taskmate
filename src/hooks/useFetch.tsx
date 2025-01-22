import { useState, useEffect } from 'react';

interface UseFetchResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * 
 * @param url - URL a la que se enviará la petición
 * @param options - Opcional. Configuración adicional para el fetch (headers, method, etc).
 * @returns {UseFetchResponse<T>} Objeto con data, loading y error.
 */

function useFetch<T>(url: string, options?: RequestInit): UseFetchResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Error al obtener los datos: ${response.statusText}`);
        }

        const json = (await response.json()) as T;
        setData(json);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, options]);

  return { data, loading, error };
}

export default useFetch;
