import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw, Users } from 'lucide-react';

interface AthleteTableHeaderProps {
  totalElements: number;
  loading: boolean;
  canCreate: boolean;
  onRefresh: () => void;
  onCreate: () => void;
}

export function AthleteTableHeader({
  totalElements,
  loading,
  canCreate,
  onRefresh,
  onCreate
}: AthleteTableHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestión de Atletas
          </CardTitle>
          <CardDescription>
            {totalElements} atletas registrados
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
          {canCreate && (
            <Button onClick={onCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Atleta
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
  );
}