import { z } from 'zod';

/**
 * Esquemas de validación para deportes usando los patterns del backend
 */

// Schema base para campos comunes
const baseSportSchema = {
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/\S/, 'El nombre no puede estar vacío'),
  
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .regex(/\S/, 'La descripción no puede estar vacía')
};

/**
 * Schema para crear un nuevo deporte
 */
export const sportCreateSchema = z.object({
  ...baseSportSchema
});

/**
 * Schema para actualizar un deporte
 */
export const sportUpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/\S/, 'El nombre no puede estar vacío')
    .optional(),
  
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .regex(/\S/, 'La descripción no puede estar vacía')
    .optional(),
    
  active: z.boolean().optional()
});

/**
 * Schema para filtros de búsqueda
 */
export const sportSearchSchema = z.object({
  search: z.string().optional(),
  active: z.boolean().optional(),
  includeCategories: z.boolean().optional(),
  sort: z.enum(['name', 'description', 'createdAt']).optional(),
  direction: z.enum(['ASC', 'DESC']).optional()
});

/**
 * Schema para gestión de categorías de un deporte
 */
export const sportCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  
  minAge: z
    .number()
    .min(5, 'La edad mínima debe ser al menos 5 años')
    .max(50, 'La edad mínima no puede exceder 50 años'),
  
  maxAge: z
    .number()
    .min(5, 'La edad máxima debe ser al menos 5 años')
    .max(50, 'La edad máxima no puede exceder 50 años'),
    
  active: z.boolean().default(true)
}).refine((data) => {
  return data.maxAge >= data.minAge;
}, {
  message: 'La edad máxima debe ser mayor o igual a la edad mínima',
  path: ['maxAge']
});

// Tipos TypeScript inferidos
export type SportCreateFormData = z.infer<typeof sportCreateSchema>;
export type SportUpdateFormData = z.infer<typeof sportUpdateSchema>;
export type SportSearchFormData = z.infer<typeof sportSearchSchema>;
export type SportCategoryFormData = z.infer<typeof sportCategorySchema>;

/**
 * Transforma datos del formulario a formato de API
 */
export function transformSportFormData(data: SportCreateFormData | SportUpdateFormData) {
  return {
    ...data,
    // Limpiar strings vacíos
    name: data.name?.trim(),
    description: data.description?.trim()
  };
}

/**
 * Valores por defecto para formularios
 */
export const defaultSportFormValues: Partial<SportCreateFormData> = {
  name: '',
  description: ''
};

/**
 * Valores por defecto para categorías
 */
export const defaultCategoryFormValues: Partial<SportCategoryFormData> = {
  name: '',
  minAge: 5,
  maxAge: 18,
  active: true
};

/**
 * Sugerencias de deportes comunes
 */
export const COMMON_SPORTS = [
  {
    name: 'Fútbol',
    description: 'Deporte de equipo jugado entre dos conjuntos de once jugadores cada uno, donde el objetivo es introducir el balón en la portería contraria usando cualquier parte del cuerpo excepto las manos.'
  },
  {
    name: 'Baloncesto',
    description: 'Deporte de equipo donde dos conjuntos de cinco jugadores intentan anotar puntos introduciendo un balón en una canasta ubicada a cierta altura.'
  },
  {
    name: 'Voleibol',
    description: 'Deporte de equipo donde dos equipos de seis jugadores están separados por una red alta y deben hacer pasar el balón por encima de la red al campo contrario.'
  },
  {
    name: 'Natación',
    description: 'Deporte acuático que consiste en el desplazamiento a través del agua mediante el uso coordinado de los miembros del cuerpo humano.'
  },
  {
    name: 'Atletismo',
    description: 'Conjunto de disciplinas deportivas que abarcan carreras, saltos, lanzamientos y pruebas combinadas realizadas en pista y campo.'
  },
  {
    name: 'Tenis',
    description: 'Deporte de raqueta practicado sobre una pista rectangular delimitada por líneas y dividida por una red.'
  }
];

/**
 * Categorías de edad típicas por deporte
 */
export const TYPICAL_AGE_CATEGORIES = {
  'Fútbol': [
    { name: 'Sub-8', minAge: 5, maxAge: 8 },
    { name: 'Sub-10', minAge: 9, maxAge: 10 },
    { name: 'Sub-12', minAge: 11, maxAge: 12 },
    { name: 'Sub-14', minAge: 13, maxAge: 14 },
    { name: 'Sub-16', minAge: 15, maxAge: 16 },
    { name: 'Sub-18', minAge: 17, maxAge: 18 },
    { name: 'Adultos', minAge: 19, maxAge: 50 }
  ],
  'Baloncesto': [
    { name: 'Mini', minAge: 5, maxAge: 9 },
    { name: 'Pre-mini', minAge: 10, maxAge: 11 },
    { name: 'Infantil', minAge: 12, maxAge: 13 },
    { name: 'Cadete', minAge: 14, maxAge: 15 },
    { name: 'Juvenil', minAge: 16, maxAge: 18 },
    { name: 'Senior', minAge: 19, maxAge: 50 }
  ],
  'Natación': [
    { name: 'Principiantes', minAge: 5, maxAge: 8 },
    { name: 'Infantil A', minAge: 9, maxAge: 10 },
    { name: 'Infantil B', minAge: 11, maxAge: 12 },
    { name: 'Juvenil A', minAge: 13, maxAge: 14 },
    { name: 'Juvenil B', minAge: 15, maxAge: 16 },
    { name: 'Junior', minAge: 17, maxAge: 18 },
    { name: 'Adultos', minAge: 19, maxAge: 50 }
  ]
};

/**
 * Helper para obtener categorías sugeridas por deporte
 */
export function getSuggestedCategories(sportName: string): SportCategoryFormData[] {
  const categories = TYPICAL_AGE_CATEGORIES[sportName as keyof typeof TYPICAL_AGE_CATEGORIES];
  return categories || [
    { name: 'Principiantes', minAge: 5, maxAge: 12, active: true },
    { name: 'Intermedios', minAge: 13, maxAge: 16, active: true },
    { name: 'Avanzados', minAge: 17, maxAge: 50, active: true }
  ];
}

/**
 * Helper para validar que no haya solapamiento de edades en categorías
 */
export function validateCategoryAges(categories: SportCategoryFormData[]): string | null {
  const sortedCategories = [...categories].sort((a, b) => a.minAge - b.minAge);
  
  for (let i = 0; i < sortedCategories.length - 1; i++) {
    const current = sortedCategories[i];
    const next = sortedCategories[i + 1];
    
    if (current.maxAge >= next.minAge) {
      return `Conflicto de edades entre "${current.name}" (${current.minAge}-${current.maxAge}) y "${next.name}" (${next.minAge}-${next.maxAge})`;
    }
  }
  
  return null;
}