import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Edit, Eye, MapPin, Trash2 } from 'lucide-react';
import { calculateAge, getNameInitials, formatGuardiansCount } from '../utils/athleteUtils';
import type { AthleteResponse } from '@/types/api';

interface AthleteTableRowProps {
  athlete: AthleteResponse;
  canEdit: boolean;
  canDelete: boolean;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function AthleteTableRow({
  athlete,
  canEdit,
  canDelete,
  onView,
  onEdit,
  onDelete
}: AthleteTableRowProps) {
  return (
    <TableRow>
      {/* Atleta */}
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>
              {getNameInitials(athlete.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{athlete.fullName}</div>
            <div className="text-sm text-muted-foreground">
              {athlete.email || 'Sin email'}
            </div>
          </div>
        </div>
      </TableCell>
      
      {/* Edad */}
      <TableCell>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {calculateAge(athlete.birthDate)} años
        </div>
      </TableCell>
      
      {/* Deporte */}
      <TableCell>
        <Badge variant="outline">
          {athlete.sport.name}
        </Badge>
      </TableCell>
      
      {/* Categoría */}
      <TableCell>
        {athlete.category.name}
      </TableCell>
      
      {/* Sede */}
      <TableCell>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {athlete.venue.name}
        </div>
      </TableCell>
      
      {/* Tutores */}
      <TableCell>
        <Badge variant="secondary">
          {formatGuardiansCount(athlete.guardians.length)}
        </Badge>
      </TableCell>
      
      {/* Estado */}
      <TableCell>
        <Badge 
          variant={athlete.active ? "default" : "secondary"}
          className={athlete.active ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {athlete.active ? 'Activo' : 'Inactivo'}
        </Badge>
      </TableCell>
      
      {/* Acciones */}
      <TableCell className="text-right">
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(athlete.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(athlete.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {canDelete && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => onDelete(athlete.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}