import { Button } from '@/components/ui/button';
import { UserPlus, Users } from 'lucide-react';

interface GuardianEmptyStateProps {
  canCreate: boolean;
  onCreateClick: () => void;
}

export function GuardianEmptyState({ canCreate, onCreateClick }: GuardianEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Users className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No hay tutores registrados</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        {canCreate 
          ? "Comience agregando el primer tutor al sistema."
          : "No se encontraron tutores con los filtros aplicados."
        }
      </p>
      {canCreate && (
        <Button onClick={onCreateClick} className="mt-4">
          <UserPlus className="h-4 w-4 mr-2" />
          Agregar Primer Tutor
        </Button>
      )}
    </div>
  );
}