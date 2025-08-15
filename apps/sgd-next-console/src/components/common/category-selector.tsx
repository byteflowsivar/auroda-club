"use client";

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Trophy } from 'lucide-react';
import { apiClient } from '@/lib/api';
import type { CategoryResponse } from '@/types/api';

interface CategorySelectorProps {
  /** ID del deporte seleccionado */
  sportId: number;
  /** Edad del atleta para filtrar categorías apropiadas */
  athleteAge?: number;
  /** Valor seleccionado actualmente */
  value?: number;
  /** Callback cuando cambia la selección */
  onValueChange: (value: number) => void;
  /** Si el selector está deshabilitado */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
}

export function CategorySelector({
  sportId,
  athleteAge,
  value,
  onValueChange,
  disabled = false,
  placeholder = "Seleccione categoría"
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar categorías cuando cambia el deporte
  useEffect(() => {
    const loadCategories = async () => {
      if (!sportId) {
        setCategories([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Cargar categorías del deporte específico
        const allCategories = await apiClient.getCategoriesBySport(sportId);
        setCategories(allCategories);
        
        // Si hay categorías y una edad definida, verificar compatibilidad
        if (allCategories.length > 0 && athleteAge) {
          const compatibleCategories = allCategories.filter(cat => 
            athleteAge >= cat.minAge && 
            athleteAge <= cat.maxAge
          );

          // Si la categoría actual no es compatible, limpiar selección
          if (value && !compatibleCategories.some(cat => cat.id === value)) {
            onValueChange(0);
          }
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Error al cargar categorías');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [sportId, athleteAge, value, onValueChange]);

  // Filtrar categorías apropiadas para el atleta
  const getFilteredCategories = () => {
    if (!athleteAge) return categories;

    return categories.filter(category => {
      const ageCompatible = athleteAge >= category.minAge && athleteAge <= category.maxAge;
      return ageCompatible;
    });
  };

  // Verificar si una categoría es recomendada
  const isCategoryRecommended = (category: CategoryResponse): boolean => {
    if (!athleteAge) return false;
    
    const ageCompatible = athleteAge >= category.minAge && athleteAge <= category.maxAge;
    
    return ageCompatible;
  };

  // Verificar si una categoría tiene advertencias
  const getCategoryWarning = (category: CategoryResponse): string | null => {
    if (!athleteAge) return null;

    if (athleteAge < category.minAge) {
      return `Edad mínima: ${category.minAge} años`;
    }
    if (athleteAge > category.maxAge) {
      return `Edad máxima: ${category.maxAge} años`;
    }

    return null;
  };

  const filteredCategories = getFilteredCategories();
  const selectedCategory = categories.find(cat => cat.id === value);

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Cargando categorías..." />
        </SelectTrigger>
      </Select>
    );
  }

  if (error) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Error al cargar categorías" />
        </SelectTrigger>
      </Select>
    );
  }

  if (!sportId) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Primero seleccione un deporte" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <div className="space-y-2">
      <Select 
        value={value?.toString() || ""} 
        onValueChange={(val) => onValueChange(parseInt(val))}
        disabled={disabled || categories.length === 0}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {/* Categorías recomendadas primero */}
          {filteredCategories.length > 0 && (
            <>
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                Categorías Recomendadas
              </div>
              {filteredCategories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  <div className="flex items-center justify-between w-full">
                    <span>{category.name}</span>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge variant="secondary" className="text-xs">
                        {category.minAge}-{category.maxAge} años
                      </Badge>
                      <Trophy className="h-3 w-3 text-green-500" />
                    </div>
                  </div>
                </SelectItem>
              ))}
            </>
          )}

          {/* Mostrar todas las categorías si no hay edad definida o hay categorías no recomendadas */}
          {(!athleteAge || categories.some(cat => !isCategoryRecommended(cat))) && (
            <>
              {filteredCategories.length > 0 && (
                <div className="border-t my-1" />
              )}
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                {filteredCategories.length > 0 ? 'Otras Categorías' : 'Categorías Disponibles'}
              </div>
              {categories
                .filter(cat => !athleteAge || !isCategoryRecommended(cat))
                .map((category) => {
                  const warning = getCategoryWarning(category);
                  
                  return (
                    <SelectItem 
                      key={category.id} 
                      value={category.id.toString()}
                      className={warning ? "opacity-60" : ""}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{category.name}</span>
                        <div className="flex items-center gap-2 ml-2">
                          <Badge variant="secondary" className="text-xs">
                            {category.minAge}-{category.maxAge} años
                          </Badge>
                          {warning && (
                            <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
            </>
          )}

          {categories.length === 0 && (
            <div className="px-2 py-1 text-sm text-muted-foreground">
              No hay categorías disponibles para este deporte
            </div>
          )}
        </SelectContent>
      </Select>

      {/* Información adicional sobre la categoría seleccionada */}
      {selectedCategory && athleteAge && (
        <div className="text-sm">
          {isCategoryRecommended(selectedCategory) ? (
            <div className="flex items-center gap-1 text-green-600">
              <Trophy className="h-3 w-3" />
              <span>Categoría recomendada para este atleta</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-yellow-600">
              <AlertTriangle className="h-3 w-3" />
              <span>{getCategoryWarning(selectedCategory)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}