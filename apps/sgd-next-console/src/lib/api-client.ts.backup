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
} from '@/types';

// Configuración base - siempre usar rutas internas de Next.js
const API_BASE_URL = '/api/sgd'; // Rutas internas que proxean al backend
const DEFAULT_TIMEOUT = 30000; // 30 segundos

// NOTA: Este cliente usa las rutas internas de Next.js (/api/sgd/*) 
// que manejan automáticamente la autenticación JWT con el backend Quarkus

// Errores personalizados
export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export class AuthenticationError extends ApiClientError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiClientError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends ApiClientError {
  constructor(message: string, public errors: unknown[]) {
    super(message, 400, 'VALIDATION_ERROR', errors);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends ApiClientError {
  constructor(message = 'Network error occurred') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

// Clase principal del cliente API
export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = DEFAULT_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  /**
   * Las cookies de sesión NextAuth se envían automáticamente al hacer fetch
   * Las rutas /api/sgd/* extraen el accessToken de la sesión server-side
   * y lo incluyen en el Authorization header al backend Quarkus
   */
  private async buildHeaders(customHeaders: Record<string, string> = {}): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    };

    // Las cookies de sesión NextAuth se envían automáticamente
    // Las rutas API server-side manejan la autenticación JWT
    return headers;
  }

  /**
   * Construye URL con query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, unknown>): string {
    // Construir la URL base
    let url = `${this.baseURL}${endpoint}`;
    
    // Agregar query parameters si existen
    if (params) {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return url;
  }

  /**
   * Maneja errores de respuesta HTTP
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: unknown;
    
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText || 'Unknown error' };
    }

    const { status } = response;
    const message = errorData.message || `HTTP Error ${status}`;

    switch (status) {
      case 400:
        if (errorData.errors && Array.isArray(errorData.errors)) {
          throw new ValidationError(message, errorData.errors);
        }
        throw new ApiClientError(message, status, 'BAD_REQUEST', errorData);
      
      case 401:
        throw new AuthenticationError(message);
      
      case 403:
        throw new AuthorizationError(message);
      
      case 404:
        throw new ApiClientError(message, status, 'NOT_FOUND');
      
      case 409:
        throw new ApiClientError(message, status, 'CONFLICT', errorData);
      
      case 422:
        throw new ValidationError(message, errorData.errors || []);
      
      case 500:
        throw new ApiClientError('Internal server error', status, 'SERVER_ERROR');
      
      default:
        throw new ApiClientError(message, status, 'UNKNOWN_ERROR', errorData);
    }
  }

  /**
   * Realiza petición HTTP genérica
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    params?: Record<string, unknown>,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    const url = this.buildURL(endpoint, params);
    const headers = await this.buildHeaders(customHeaders);

    const config: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    try {
      console.log(`[API] ${method} ${url}`);
      
      const response = await fetch(url, config);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Si es DELETE y responde 204, no hay contenido que parsear
      if (response.status === 204) {
        return {} as T;
      }

      const result = await response.json();
      console.log(`[API] ${method} ${url} - Success`);
      return result;
      
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'TimeoutError') {
        throw new NetworkError('Request timeout');
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError('Network connection failed');
      }

      console.error(`[API] ${method} ${url} - Error:`, error);
      throw new NetworkError('Request failed');
    }
  }

  // =============================================================================
  // MÉTODOS PÚBLICOS GENÉRICOS
  // =============================================================================

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
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
    return this.get<AthletePageResponse>('/athletes', params);
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
    return this.get<GuardianPageResponse>('/guardians', params);
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
    return this.get<SportResponse[]>('/sports', params);
  }

  async getSport(id: number): Promise<SportResponse> {
    return this.get<SportResponse>(`/sports/${id}`);
  }

  async getSportCategories(id: number, age?: number): Promise<CategoryResponse[]> {
    const params = age ? { age } : undefined;
    return this.get<CategoryResponse[]>(`/sports/${id}/categories`, params);
  }

  async getCategories(params?: CategoryListParams): Promise<CategoryResponse[]> {
    return this.get<CategoryResponse[]>('/categories', params);
  }

  async getCategoriesByAge(age: number): Promise<CategoryResponse[]> {
    return this.get<CategoryResponse[]>(`/categories/by-age/${age}`);
  }

  async getCategory(id: number): Promise<CategoryResponse> {
    return this.get<CategoryResponse>(`/categories/${id}`);
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

// Instancia singleton del cliente API
export const apiClient = new ApiClient();

// Exportar también la clase para casos de uso específicos
export default apiClient;