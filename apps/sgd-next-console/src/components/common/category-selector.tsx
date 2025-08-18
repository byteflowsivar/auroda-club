"use client";

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Trophy } from 'lucide-react';
import { apiClient } from '@/lib/api';
import type { CategoryResponse } from '@/types/api';

interface CategorySelectorProps {
  /** ID del deporte seleccionado */
  sportId: number;
  /** Edad del atleta para filtrar categorías apropiadas */
  athleteAge?: number;
  /** Género del atleta para filtrar categorías apropiadas */
  athleteGender?: 'M' | 'F' | '' | undefined; // Added this prop
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
  athleteGender, // Added to destructuring
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
        
        console.log('🔍 Cargando categorías para deporte:', sportId);
        
        // Cargar categorías del deporte específico
        const allCategories = await apiClient.getCategoriesBySport(sportId);
        
        console.log('📦 Categorías recibidas:', allCategories);
        console.log('📊 Cantidad de categorías:', allCategories.length);
        
        setCategories(allCategories);
        
        // Si la categoría actual no es compatible con la edad, limpiar selección
        if (value && athleteAge) {
          const selectedCategory = allCategories.find(cat => cat.id === value);
          if (selectedCategory && (athleteAge < selectedCategory.minAge || athleteAge > selectedCategory.maxAge)) {
            console.log('⚠️ Categoría actual no compatible con edad, limpiando selección');
            onValueChange(0);
          }
        }
      } catch (err) {
        console.error('❌ Error loading categories:', err);
        setError('Error al cargar categorías');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [sportId, athleteAge, value, onValueChange]);

  // Filtrar categorías apropiadas para el atleta (solo por edad)
  const getFilteredCategories = () => {
    if (!athleteAge) return categories; // Si no hay edad, mostrar todas

    return categories.filter(category => {
      return athleteAge >= category.minAge && athleteAge <= category.maxAge;
    });
  };

  // Verificar si una categoría es recomendada (compatible con edad)
  const isCategoryRecommended = (category: CategoryResponse): boolean => {
    if (!athleteAge) return false; // Si no hay edad, no hay recomendación
    
    return athleteAge >= category.minAge && athleteAge <= category.maxAge;
  };

  // Verificar si una categoría tiene advertencias
  const getCategoryWarning = (category: CategoryResponse): string | null => {
    if (!athleteAge) return null;

    const warnings: string[] = [];

    if (athleteAge < category.minAge) {
      warnings.push(`Edad mínima: ${category.minAge} años`);
    }
    if (athleteAge > category.maxAge) {
      warnings.push(`Edad máxima: ${category.maxAge} años`);
    }

    return warnings.length > 0 ? warnings.join('; ') : null;
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
          {/* Mostrar categorías recomendadas primero si hay edad */}
          {athleteAge && filteredCategories.length > 0 && (
            <>
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                🏆 Categorías Recomendadas (Edad: {athleteAge} años)
              </div>
              {filteredCategories.map((category) => (
                <SelectItem key={`rec-${category.id}`} value={category.id.toString()}>
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

          {/* Separador si hay recomendadas y otras */}
          {athleteAge && filteredCategories.length > 0 && filteredCategories.length < categories.length && (
            <div className="border-t my-1" />
          )}

          {/* Mostrar todas las categorías o las no recomendadas */}
          {(() => {
            const nonRecommended = athleteAge ? 
              categories.filter(cat => !isCategoryRecommended(cat)) : 
              categories;
            
            if (nonRecommended.length === 0) return null;

            return (
              <>
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  {athleteAge && filteredCategories.length > 0 ? 
                    '📋 Otras Categorías' : 
                    '📋 Categorías Disponibles'
                  }
                </div>
                {nonRecommended.map((category) => {
                  const warning = getCategoryWarning(category);
                  
                  return (
                    <SelectItem 
                      key={`other-${category.id}`} 
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
            );
          })()}

          {categories.length === 0 && !loading && (
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
              <span>Categoría recomendada para {athleteAge} años</span>
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