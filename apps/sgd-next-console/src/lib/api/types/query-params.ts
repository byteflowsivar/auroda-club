/**
 * Types para parámetros de consulta (query parameters)
 */

export type QueryParamValue = string | number | boolean;

export type QueryParamArrayValue = string[] | number[];

export type QueryParamPrimitive = QueryParamValue | QueryParamArrayValue;

export interface QueryParams {
  [key: string]: QueryParamPrimitive | undefined;
}

export type QueryParamsLike = QueryParams | Record<string, unknown>;

/**
 * Valida y convierte un valor a string para URL
 */
export function formatQueryParam(value: QueryParamPrimitive): string {
  if (Array.isArray(value)) {
    return value.join(',');
  }
  return String(value);
}

/**
 * Filtra valores válidos para query parameters
 */
export function isValidQueryParam(value: QueryParamPrimitive | undefined): value is QueryParamPrimitive {
  return value !== undefined && value !== null && value !== '';
}