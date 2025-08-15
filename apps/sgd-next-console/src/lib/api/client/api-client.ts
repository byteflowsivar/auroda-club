import type {
  AthleteResponse,
  AthleteCreateRequest,
  AthleteUpdateRequest,
  AthletePageResponse,
  AthleteListParams,
  GuardianResponse,
  GuardianCreateRequest,
  GuardianUpdateRequest,
  GuardianPageResponse,
  GuardianListParams,
  GuardianAssociationRequest,
  GuardianAssociationResponse,
  SportResponse,
  SportListParams,
  CategoryResponse,
  CategoryListParams,
  ClubResponse,
  VenueResponse,
  GuardianInfo,
  AthleteInfo
} from '@/types/api';

import type { 
  ApiClientConfig, 
  RequestConfig, 
  HttpMethod
} from '@/lib/api';

import { DEFAULT_CONFIG } from '@/lib/api';

import type { 
  QueryParamsLike 
} from '../types/query-params';

import type { 
  ApiErrorData,
  ValidationErrorDetail 
} from '@/lib/api';

import { ApiClientError } from '@/lib/api';
import { AuthenticationError } from '@/lib/api';
import { AuthorizationError } from '@/lib/api';
import { ValidationError } from '@/lib/api';
import { NetworkError } from '@/lib/api';
import { UrlBuilder } from '@/lib/api';

/**
 * Cliente HTTP tipado para la API del backend Quarkus
 * Maneja automáticamente la autenticación JWT via cookies NextAuth
 */
export class ApiClient {
  private readonly config: ApiClientConfig;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Construye headers HTTP con defaults y personalizados
   */
  private buildHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    return {
      ...this.config.defaultHeaders,
      ...customHeaders,
    };
  }

  /**
   * Parsea respuesta de error de forma tipada
   */
  private async parseErrorResponse(response: Response): Promise<ApiErrorData> {
    try {
      const data = await response.json();
      return this.validateErrorData(data);
    } catch {
      return { 
        message: response.statusText || 'Unknown error',
        status: response.status 
      };
    }
  }

  /**
   * Valida y normaliza datos de error
   */
  private validateErrorData(data: unknown): ApiErrorData {
    if (!data || typeof data !== 'object') {
      return { message: 'Invalid error response' };
    }

    const errorData = data as Record<string, unknown>;
    
    return {
      message: typeof errorData.message === 'string' ? errorData.message : undefined,
      status: typeof errorData.status === 'number' ? errorData.status : undefined,
      timestamp: typeof errorData.timestamp === 'string' ? errorData.timestamp : undefined,
      path: typeof errorData.path === 'string' ? errorData.path : undefined,
      details: typeof errorData.details === 'string' ? errorData.details : undefined,
      errors: Array.isArray(errorData.errors) ? this.validateErrors(errorData.errors) : undefined,
    };
  }

  /**
   * Valida array de errores de validación
   */
  private validateErrors(errors: unknown[]): ValidationErrorDetail[] {
    return errors
      .filter((error): error is Record<string, unknown> => 
        !!error && typeof error === 'object'
      )
      .map(error => ({
        field: typeof error.field === 'string' ? error.field : 'unknown',
        message: typeof error.message === 'string' ? error.message : 'Invalid value',
        rejectedValue: this.extractRejectedValue(error.rejectedValue),
      }));
  }

  /**
   * Extrae valor rechazado de forma segura
   */
  private extractRejectedValue(value: unknown): string | number | boolean | null {
    if (value === null || value === undefined) {
      return null;
    }
    
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }
    
    return String(value);
  }

  /**
   * Maneja errores de respuesta HTTP
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    const errorData = await this.parseErrorResponse(response);
    const { status } = response;
    const message = errorData.message || `HTTP Error ${status}`;

    switch (status) {
      case 400:
        if (errorData.errors && errorData.errors.length > 0) {
          throw new ValidationError(message, errorData.errors);
        }
        throw new ApiClientError(message, status, 'BAD_REQUEST');
      
      case 401:
        throw new AuthenticationError(message);
      
      case 403:
        throw new AuthorizationError(message);
      
      case 404:
        throw new ApiClientError(message, status, 'NOT_FOUND');
      
      case 409:
        throw new ApiClientError(message, status, 'CONFLICT');
      
      case 422:
        throw new ValidationError(message, errorData.errors || []);
      
      case 500:
        throw new ApiClientError('Internal server error', status, 'SERVER_ERROR');
      
      default:
        throw new ApiClientError(message, status, 'UNKNOWN_ERROR');
    }
  }

  /**
   * Ejecuta petición HTTP tipada
   */
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    data?: unknown,
    params?: QueryParamsLike,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    const url = UrlBuilder.buildURL(this.config.baseURL, endpoint, params);
    const headers = this.buildHeaders(customHeaders);

    const requestConfig: RequestConfig = {
      method,
      headers,
      signal: AbortSignal.timeout(this.config.timeout),
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestConfig.body = JSON.stringify(data);
    }

    try {
      console.log(`[API] ${method} ${url}`);
      
      const response = await fetch(url, requestConfig);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // DELETE puede retornar 204 sin contenido
      if (response.status === 204) {
        return {} as T;
      }

      const result = await response.json();
      console.log(`[API] ${method} ${url} - Success`);
      return result as T;
      
    } catch (error) {
      // Re-lanzar errores de API ya procesados
      if (error instanceof ApiClientError) {
        throw error;
      }

      // Manejar errores de timeout
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        throw NetworkError.timeout(this.config.timeout);
      }

      // Manejar errores de fetch
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw NetworkError.connectionFailed(error);
      }

      console.error(`[API] ${method} ${url} - Error:`, error);
      throw NetworkError.requestFailed(error as Error);
    }
  }

  // =============================================================================
  // MÉTODOS PÚBLICOS GENÉRICOS
  // =============================================================================

  async get<T>(endpoint: string, params?: QueryParamsLike): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, params);
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>('PUT', endpoint, data);
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>('PATCH', endpoint, data);
  }

  async delete<T = void>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }

  // =============================================================================
  // MÉTODOS ESPECÍFICOS PARA ATLETAS
  // =============================================================================

  async getAthletes(params?: AthleteListParams): Promise<AthletePageResponse> {
    return this.get<AthletePageResponse>('/athletes', params as QueryParamsLike);
  }

  async getAthlete(id: number): Promise<AthleteResponse> {
    return this.get<AthleteResponse>(`/athletes/${id}`);
  }

  async createAthlete(data: AthleteCreateRequest): Promise<AthleteResponse> {
    return this.post<AthleteResponse>('/athletes', data);
  }

  async updateAthlete(id: number, data: AthleteUpdateRequest): Promise<AthleteResponse> {
    return this.put<AthleteResponse>(`/athletes/${id}`, data);
  }

  async deleteAthlete(id: number): Promise<void> {
    return this.delete<void>(`/athletes/${id}`);
  }

  async getAthleteGuardians(id: number): Promise<GuardianInfo[]> {
    return this.get<GuardianInfo[]>(`/athletes/${id}/guardians`);
  }

  async associateGuardian(athleteId: number, data: GuardianAssociationRequest): Promise<GuardianAssociationResponse> {
    return this.post<GuardianAssociationResponse>(`/athletes/${athleteId}/guardians`, data);
  }

  // =============================================================================
  // MÉTODOS ESPECÍFICOS PARA TUTORES
  // =============================================================================

  async getGuardians(params?: GuardianListParams): Promise<GuardianPageResponse> {
    return this.get<GuardianPageResponse>('/guardians', params as QueryParamsLike);
  }

  async getGuardian(id: number): Promise<GuardianResponse> {
    return this.get<GuardianResponse>(`/guardians/${id}`);
  }

  async createGuardian(data: GuardianCreateRequest): Promise<GuardianResponse> {
    return this.post<GuardianResponse>('/guardians', data);
  }

  async updateGuardian(id: number, data: GuardianUpdateRequest): Promise<GuardianResponse> {
    return this.put<GuardianResponse>(`/guardians/${id}`, data);
  }

  async deleteGuardian(id: number): Promise<void> {
    return this.delete<void>(`/guardians/${id}`);
  }

  async getGuardianAthletes(id: number): Promise<AthleteInfo[]> {
    return this.get<AthleteInfo[]>(`/guardians/${id}/athletes`);
  }

  // =============================================================================
  // MÉTODOS ESPECÍFICOS PARA DEPORTES Y CATEGORÍAS
  // =============================================================================

  async getSports(params?: SportListParams): Promise<SportResponse[]> {
    return this.get<SportResponse[]>('/sports', params as QueryParamsLike);
  }

  async getSport(id: number): Promise<SportResponse> {
    return this.get<SportResponse>(`/sports/${id}`);
  }

  async getSportCategories(id: number, age?: number): Promise<CategoryResponse[]> {
    const params = age ? { age } : undefined;
    return this.get<CategoryResponse[]>(`/sports/${id}/categories`, params as QueryParamsLike);
  }

  async getCategories(params?: CategoryListParams): Promise<CategoryResponse[]> {
    return this.get<CategoryResponse[]>('/categories', params as QueryParamsLike);
  }

  async getCategoriesByAge(age: number): Promise<CategoryResponse[]> {
    return this.get<CategoryResponse[]>(`/categories/by-age/${age}`);
  }

  async getCategory(id: number): Promise<CategoryResponse> {
    return this.get<CategoryResponse>(`/categories/${id}`);
  }

  async getCategoriesBySport(sportId: number): Promise<CategoryResponse[]> {
    return this.getSportCategories(sportId);
  }

  // =============================================================================
  // MÉTODOS ESPECÍFICOS PARA CLUBES Y SEDES
  // =============================================================================

  async getClubs(): Promise<ClubResponse[]> {
    return this.get<ClubResponse[]>('/clubs');
  }

  async getClub(id: number): Promise<ClubResponse> {
    return this.get<ClubResponse>(`/clubs/${id}`);
  }

  async getClubVenues(id: number): Promise<VenueResponse[]> {
    return this.get<VenueResponse[]>(`/clubs/${id}/venues`);
  }

  async getVenues(): Promise<VenueResponse[]> {
    return this.get<VenueResponse[]>('/venues');
  }

  async getVenue(id: number): Promise<VenueResponse> {
    return this.get<VenueResponse>(`/venues/${id}`);
  }
}