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
    (session?.user?.roles?.includes('ADMIN_GENERAL') ?? false) || 
    (session?.user?.roles?.includes('ADMIN_CLUB') ?? false)
  );
  
  const canDelete = !readOnly && (session?.user?.roles?.includes('ADMIN_GENERAL') ?? false);
  
  const canCreate = canEdit; // Misma lógica que editar

  return {
    canEdit,
    canDelete,
    canCreate
  };
};