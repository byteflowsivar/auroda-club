import { z } from 'zod';
import { PHONE_PATTERN } from '@/types/api';

/**
 * Esquemas de validación para tutores usando los patterns del backend
 */

// Schema base para campos comunes
const baseGuardianSchema = {
  fullName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres')
    .regex(/\S/, 'El nombre no puede estar vacío'),
  
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'El email no puede exceder 255 caracteres')
    .optional()
    .or(z.literal('')),
  
  phone: z
    .string()
    .regex(PHONE_PATTERN, 'Formato: +503 1234-5678')
    .max(50, 'El teléfono no puede exceder 50 caracteres')
    .optional()
    .or(z.literal('')),
  
  secondaryPhone: z
    .string()
    .regex(/^(\+503\s[0-9]{4}-[0-9]{4})?$/, 'Formato: +503 1234-5678')
    .max(50, 'El teléfono no puede exceder 50 caracteres')
    .optional()
    .or(z.literal('')),
  
  address: z
    .string()
    .max(1000, 'La dirección no puede exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
  
  identificationNumber: z
    .string()
    .max(50, 'La identificación no puede exceder 50 caracteres')
    .optional()
    .or(z.literal(''))
};

/**
 * Schema para crear un nuevo tutor
 */
export const guardianCreateSchema = z.object({
  ...baseGuardianSchema
}).refine((data) => {
  // Al menos uno de email o teléfono debe estar presente
  return data.email || data.phone;
}, {
  message: 'Debe proporcionar al menos un email o teléfono de contacto',
  path: ['email'] // Se mostrará en el campo email
});

/**
 * Schema para actualizar un tutor
 */
export const guardianUpdateSchema = z.object({
  ...baseGuardianSchema,
  fullName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres')
    .regex(/\S/, 'El nombre no puede estar vacío')
    .optional()
}).refine((data) => {
  // Si se proporciona email o phone, validar que al menos uno no esté vacío
  if (data.email !== undefined || data.phone !== undefined) {
    return data.email || data.phone;
  }
  return true;
}, {
  message: 'Debe proporcionar al menos un email o teléfono de contacto',
  path: ['email']
});

/**
 * Schema para filtros de búsqueda
 */
export const guardianSearchSchema = z.object({
  search: z.string().optional(),
  active: z.boolean().optional(),
  hasAthletes: z.boolean().optional(),
  page: z.number().min(0).optional(),
  size: z.number().min(1).max(100).optional(),
  sort: z.enum(['fullName', 'email', 'createdAt']).optional(),
  direction: z.enum(['ASC', 'DESC']).optional()
});

// Tipos TypeScript inferidos
export type GuardianCreateFormData = z.infer<typeof guardianCreateSchema>;
export type GuardianUpdateFormData = z.infer<typeof guardianUpdateSchema>;
export type GuardianSearchFormData = z.infer<typeof guardianSearchSchema>;

/**
 * Transforma datos del formulario a formato de API
 */
export function transformGuardianFormData(data: GuardianCreateFormData | GuardianUpdateFormData) {
  return {
    ...data,
    // Convertir strings vacíos a undefined para campos opcionales
    email: data.email?.trim() || undefined,
    phone: data.phone?.trim() || undefined,
    secondaryPhone: data.secondaryPhone?.trim() || undefined,
    address: data.address?.trim() || undefined,
    identificationNumber: data.identificationNumber?.trim() || undefined
  };
}

/**
 * Valores por defecto para formularios
 */
export const defaultGuardianFormValues: Partial<GuardianCreateFormData> = {
  fullName: '',
  email: '',
  phone: '',
  secondaryPhone: '',
  address: '',
  identificationNumber: ''
};

/**
 * Helper para validar teléfonos salvadoreños
 */
export function isValidSalvadoranPhone(phone: string): boolean {
  return PHONE_PATTERN.test(phone);
}

/**
 * Helper para formatear teléfonos
 */
export function formatSalvadoranPhone(phone: string): string {
  // Remover todo excepto números
  const numbers = phone.replace(/\D/g, '');
  
  // Si empieza con 503, asumir que es completo
  if (numbers.startsWith('503') && numbers.length === 11) {
    return `+503 ${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
  
  // Si tiene 8 dígitos, agregar código de país
  if (numbers.length === 8) {
    return `+503 ${numbers.slice(0, 4)}-${numbers.slice(4, 8)}`;
  }
  
  return phone; // Retornar original si no se puede formatear
}