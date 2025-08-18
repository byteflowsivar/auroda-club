import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { getNameInitials, formatContactInfo, formatAthletesCount } from '../utils/guardianUtils';
import type { GuardianResponse } from '@/types/api';

interface GuardianTableRowProps {
  guardian: GuardianResponse;
  canEdit: boolean;
  canDelete: boolean;
  selectionMode?: boolean;
  selectedId?: number;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onSelect?: (guardian: GuardianResponse) => void;
}

export function GuardianTableRow({
  guardian,
  canEdit,
  canDelete,
  selectionMode = false,
  selectedId,
  onView,
  onEdit,
  onDelete,
  onSelect
}: GuardianTableRowProps) {
  const isSelected = selectedId === guardian.id;

  return (
    <TableRow 
      className={`${selectionMode ? 'cursor-pointer hover:bg-muted/50' : ''} ${isSelected ? 'bg-blue-50' : ''}`}
      onClick={selectionMode ? () => onSelect?.(guardian) : undefined}
    >
      {/* Tutor */}
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>
              {getNameInitials(guardian.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{guardian.fullName}</span>
              {selectionMode && isSelected && (
                <Badge variant="default" className="text-xs">
                  Seleccionado
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatContactInfo(guardian.email, guardian.phone)}
            </div>
          </div>
        </div>
      </TableCell>
      
      {/* Atletas */}
      <TableCell>
        <Badge variant="secondary">
          {formatAthletesCount(guardian.athletes?.length || 0)}
        </Badge>
      </TableCell>
      
      {/* Estado */}
      <TableCell>
        <Badge 
          variant={guardian.active ? "default" : "secondary"}
          className={guardian.active ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {guardian.active ? 'Activo' : 'Inactivo'}
        </Badge>
      </TableCell>
      
      {/* Acciones */}
      {!selectionMode && (
        <TableCell className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(guardian.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {canEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(guardian.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => onDelete(guardian.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}