import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Trophy, Target, Calendar } from 'lucide-react';
import { formatDate } from '../utils/sportUtils'; // Assuming sportUtils.ts is created
import type { SportResponse } from '@/types/api';

interface SportTableRowProps {
  sport: SportResponse;
  canEdit: boolean;
  canDelete: boolean;
  selectionMode?: boolean;
  selectedId?: number;
  onView: (sport: SportResponse) => void;
  onEdit: (sport: SportResponse) => void;
  onDelete: (sport: SportResponse) => void;
  onSelect?: (sport: SportResponse) => void;
}

export function SportTableRow({
  sport,
  canEdit,
  canDelete,
  selectionMode = false,
  selectedId,
  onView,
  onEdit,
  onDelete,
  onSelect
}: SportTableRowProps) {
  return (
    <TableRow
      key={sport.id}
      className={`${selectionMode ? 'cursor-pointer hover:bg-muted/50' : ''} ${selectedId === sport.id ? 'bg-blue-50' : ''}`}
      onClick={selectionMode ? () => onSelect?.(sport) : undefined}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <Trophy className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{sport.name}</span>
              {selectionMode && selectedId === sport.id && (
                <Badge variant="default" className="text-xs">
                  Seleccionado
                </Badge>
              )}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
          {sport.description}
        </p>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Target className="h-3 w-3" />
          <span className="text-sm font-medium">
            {sport.categories?.length || 0}
          </span>
          <span className="text-sm text-muted-foreground">
            categoría{sport.categories?.length !== 1 ? 's' : ''}
          </span>
        </div>
        {sport.categories && sport.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {sport.categories.slice(0, 2).map((category) => (
              <Badge key={category.id} variant="outline" className="text-xs">
                {category.name}
              </Badge>
            ))}
            {sport.categories.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{sport.categories.length - 2}
              </Badge>
            )}
          </div>
        )}
      </TableCell>
      <TableCell>
        <Badge 
          variant={sport.active ? "default" : "secondary"}
          className={sport.active ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {sport.active ? 'Activo' : 'Inactivo'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {formatDate(sport.createdAt)}
        </div>
      </TableCell>
      <TableCell className="text-right">
        {!selectionMode && (
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(sport)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(sport)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            
            {canDelete && sport.categories?.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => onDelete(sport)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}