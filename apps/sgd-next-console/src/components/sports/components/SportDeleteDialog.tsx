import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { SportResponse } from '@/types/api';

interface SportDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  sport?: SportResponse | null;
  deleting: boolean;
}

export function SportDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  sport,
  deleting
}: SportDeleteDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    // Dialog will be closed by parent state update after deletion
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar deporte?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción marcará el deporte <strong>{sport?.name}</strong> como inactivo. Esta acción no se puede deshacer.
            {sport?.categories && sport.categories.length > 0 && (
              <>
                <br /><br />
                <strong>Nota:</strong> Este deporte tiene {sport.categories.length}{' '}
                categoría{sport.categories.length !== 1 ? 's' : ''} asociada{sport.categories.length !== 1 ? 's' : ''}.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleting || (sport?.categories?.length || 0) > 0}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}