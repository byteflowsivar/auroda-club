import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, UserPlus, Users } from 'lucide-react';

interface GuardianTableHeaderProps {
  totalElements: number;
  loading: boolean;
  canCreate: boolean;
  selectionMode?: boolean;
  onRefresh: () => void;
  onCreate: () => void;
}

export function GuardianTableHeader({
  totalElements,
  loading,
  canCreate,
  selectionMode = false,
  onRefresh,
  onCreate
}: GuardianTableHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {selectionMode ? 'Seleccionar Tutor' : 'Gestión de Tutores'}
          </CardTitle>
          <CardDescription>
            {selectionMode 
              ? 'Seleccione un tutor para asociar al atleta'
              : `${totalElements} tutores registrados`
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
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo Tutor
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
  );
}