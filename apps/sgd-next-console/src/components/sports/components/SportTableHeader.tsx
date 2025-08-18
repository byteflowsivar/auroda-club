import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw, Trophy } from 'lucide-react';

interface SportTableHeaderProps {
  totalElements: number;
  loading: boolean;
  canCreate: boolean;
  selectionMode?: boolean;
  onRefresh: () => void;
  onCreate: () => void;
}

export function SportTableHeader({
  totalElements,
  loading,
  canCreate,
  selectionMode = false,
  onRefresh,
  onCreate
}: SportTableHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {selectionMode ? 'Seleccionar Deporte' : 'Gestión de Deportes'}
          </CardTitle>
          <CardDescription>
            {selectionMode 
              ? 'Seleccione un deporte para configurar'
              : `${totalElements} deportes registrados`
            }
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          {!selectionMode && canCreate && (
            <Button onClick={onCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Deporte
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
  );
}