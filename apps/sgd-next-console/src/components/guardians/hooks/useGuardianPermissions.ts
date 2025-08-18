import { useSession } from 'next-auth/react';

interface UseGuardianPermissionsReturn {
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
}

export const useGuardianPermissions = (
  readOnly: boolean = false
): UseGuardianPermissionsReturn => {
  const { data: session } = useSession();

  const canEdit = !readOnly && (
    session?.user?.roles?.includes('ADMIN_GENERAL') || 
    session?.user?.roles?.includes('ADMIN_CLUB')
  );
  
  const canDelete = !readOnly && session?.user?.roles?.includes('ADMIN_GENERAL');
  
  const canCreate = canEdit; // Misma lógica que editar

  return {
    canEdit,
    canDelete,
    canCreate
  };
};