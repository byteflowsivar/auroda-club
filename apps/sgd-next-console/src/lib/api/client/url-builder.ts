import type { QueryParamsLike } from '../types/query-params';

/**
 * Utilidad para construcción de URLs con query parameters tipados
 */
export class UrlBuilder {
  /**
   * Construye URL completa con query parameters
   */
  static buildURL(baseURL: string, endpoint: string, params?: QueryParamsLike): string {
    let url = `${baseURL}${endpoint}`;
    
    if (params && Object.keys(params).length > 0) {
      const queryString = UrlBuilder.buildQueryString(params);
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return url;
  }

  /**
   * Construye query string desde parámetros tipados
   */
  private static buildQueryString(params: QueryParamsLike): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      // Handle both QueryParams and Record<string, unknown>
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Handle arrays (join with comma)
          if (value.length > 0) {
            searchParams.append(key, value.join(','));
          }
        } else {
          // Handle primitive values
          searchParams.append(key, String(value));
        }
      }
    });
    
    return searchParams.toString();
  }
}