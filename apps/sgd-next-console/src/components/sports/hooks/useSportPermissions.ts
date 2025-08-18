import { useSession } from 'next-auth/react';

interface UseSportPermissionsReturn {
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
}

export const useSportPermissions = (): UseSportPermissionsReturn => {
  const { data: session } = useSession();

  // Verificar permisos basados en rol del usuario
  const canCreate = session?.user?.roles?.includes('ADMIN_GENERAL') || false;
  const canEdit = session?.user?.roles?.includes('ADMIN_GENERAL') || false;
  const canDelete = session?.user?.roles?.includes('ADMIN_GENERAL') || false;

  return {
    canEdit,
    canDelete,
    canCreate
  };
};