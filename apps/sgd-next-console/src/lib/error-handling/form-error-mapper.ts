import { ValidationError } from '../api';

/**
 * Mapeo de errores de formulario para integración con bibliotecas de forms
 */
export interface FormErrorMap {
  [fieldName: string]: string;
}

/**
 * Información de error específica de campo
 */
export interface FieldError {
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Convierte errores de validación a un mapa de errores de formulario
 */
export function mapValidationErrorsToForm(error: Error): FormErrorMap {
  if (!(error instanceof ValidationError)) {
    return {};
  }

  if (!error.validationErrors || error.validationErrors.length === 0) {
    return {};
  }

  const fieldErrors: FormErrorMap = {};

  error.validationErrors.forEach((validationError) => {
    if (validationError.field) {
      // Usar solo el primer error por campo
      if (!fieldErrors[validationError.field]) {
        fieldErrors[validationError.field] = validationError.message || 'Valor inválido';
      }
    }
  });

  return fieldErrors;
}

/**
 * Obtiene todos los errores de un campo específico
 */
export function getFieldErrors(error: Error, fieldName: string): FieldError[] {
  if (!(error instanceof ValidationError)) {
    return [];
  }

  if (!error.validationErrors || error.validationErrors.length === 0) {
    return [];
  }

  return error.validationErrors
    .filter(validationError => validationError.field === fieldName)
    .map(validationError => ({
      field: validationError.field,
      message: validationError.message || 'Valor inválido',
      value: validationError.rejectedValue,
    }));
}

/**
 * Obtiene el primer error de un campo específico
 */
export function getFirstFieldError(error: Error, fieldName: string): string | null {
  const fieldErrors = getFieldErrors(error, fieldName);
  return fieldErrors.length > 0 ? fieldErrors[0].message : null;
}

/**
 * Verifica si un campo específico tiene errores
 */
export function hasFieldError(error: Error, fieldName: string): boolean {
  return getFieldErrors(error, fieldName).length > 0;
}

/**
 * Obtiene el resumen de errores para mostrar al usuario
 */
export function getFormErrorSummary(error: Error): {
  totalErrors: number;
  fieldsWithErrors: string[];
  summary: string;
} {
  const fieldErrors = mapValidationErrorsToForm(error);
  const fieldsWithErrors = Object.keys(fieldErrors);
  const totalErrors = fieldsWithErrors.length;

  let summary = '';
  if (totalErrors === 1) {
    summary = `Error en el campo: ${fieldsWithErrors[0]}`;
  } else if (totalErrors > 1) {
    const firstFields = fieldsWithErrors.slice(0, 3).join(', ');
    summary = totalErrors <= 3 
      ? `Errores en: ${firstFields}`
      : `Errores en: ${firstFields} y ${totalErrors - 3} más`;
  }

  return {
    totalErrors,
    fieldsWithErrors,
    summary,
  };
}

/**
 * Transforma nombres de campo de la API a nombres user-friendly
 */
const FIELD_NAME_MAP: Record<string, string> = {
  fullName: 'Nombre completo',
  birthDate: 'Fecha de nacimiento',
  email: 'Correo electrónico',
  phone: 'Teléfono',
  address: 'Dirección',
  identificationNumber: 'Número de identificación',
  emergencyContact: 'Contacto de emergencia',
  emergencyPhone: 'Teléfono de emergencia',
  medicalNotes: 'Notas médicas',
  venueId: 'Sede',
  sportId: 'Deporte',
  categoryId: 'Categoría',
  relationship: 'Relación',
  guardianId: 'Tutor',
  secondaryPhone: 'Teléfono secundario',
};

/**
 * Convierte nombre de campo técnico a nombre amigable
 */
export function getFriendlyFieldName(fieldName: string): string {
  return FIELD_NAME_MAP[fieldName] || fieldName;
}

/**
 * Convierte errores de validación con nombres amigables
 */
export function mapValidationErrorsWithFriendlyNames(error: Error): FormErrorMap {
  const rawErrors = mapValidationErrorsToForm(error);
  const friendlyErrors: FormErrorMap = {};

  Object.entries(rawErrors).forEach(([fieldName, message]) => {
    const friendlyName = getFriendlyFieldName(fieldName);
    friendlyErrors[fieldName] = message.replace(
      new RegExp(`\\b${fieldName}\\b`, 'gi'),
      friendlyName
    );
  });

  return friendlyErrors;
}

/**
 * Integración específica para React Hook Form
 */
export function mapToReactHookFormErrors(error: Error): Record<string, { message: string }> {
  const fieldErrors = mapValidationErrorsToForm(error);
  const reactHookFormErrors: Record<string, { message: string }> = {};

  Object.entries(fieldErrors).forEach(([fieldName, message]) => {
    reactHookFormErrors[fieldName] = { message };
  });

  return reactHookFormErrors;
}