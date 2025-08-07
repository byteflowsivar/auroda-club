import Link from "next/link"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface AuthErrorPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams
  const error = params?.error

  const getErrorMessage = (error: string | undefined) => {
    switch (error) {
      case "Configuration":
        return {
          title: "Error de Configuración",
          description: "Hay un problema con la configuración del servidor de autenticación. Por favor contacta al administrador del sistema.",
          suggestion: "Verifica que Keycloak esté configurado correctamente y que las credenciales del cliente sean válidas."
        }
      case "AccessDenied":
        return {
          title: "Acceso Denegado",
          description: "No tienes permisos para acceder a esta aplicación. Por favor contacta a tu administrador para obtener los permisos necesarios.",
          suggestion: "Verifica que tu usuario tenga los roles correctos asignados en el sistema."
        }
      case "Verification":
        return {
          title: "Error de Verificación",
          description: "No se pudo verificar tu identidad. El enlace puede haber expirado o ser inválido.",
          suggestion: "Intenta iniciar sesión nuevamente para obtener un nuevo enlace de verificación."
        }
      case "OAuthAccountNotLinked":
        return {
          title: "Cuenta No Vinculada",
          description: "Esta cuenta ya está vinculada con otro proveedor de identidad.",
          suggestion: "Intenta iniciar sesión con el proveedor original o contacta al administrador para desvincular la cuenta."
        }
      case "OAuthCallback":
        return {
          title: "Error de Autenticación",
          description: "Se produjo un error durante el proceso de autenticación con Keycloak.",
          suggestion: "Esto puede deberse a una configuración incorrecta o problemas de conectividad."
        }
      case "RefreshAccessTokenError":
        return {
          title: "Error de Token",
          description: "No se pudo renovar tu sesión. Tu token de acceso ha expirado.",
          suggestion: "Por favor inicia sesión nuevamente para continuar."
        }
      default:
        return {
          title: "Error de Autenticación",
          description: "Se produjo un error inesperado durante el proceso de autenticación.",
          suggestion: "Por favor intenta nuevamente. Si el problema persiste, contacta al soporte técnico."
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-error-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-error-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {errorInfo.title}
          </h1>

          {/* Description */}
          <p className="text-text-secondary mb-4">
            {errorInfo.description}
          </p>

          {/* Technical details */}
          {error && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="text-left">
                <h3 className="text-sm font-medium text-text-primary mb-2">
                  Detalles técnicos:
                </h3>
                <p className="text-xs text-text-muted mb-2">
                  <strong>Código de error:</strong> {error}
                </p>
                <p className="text-xs text-text-muted">
                  <strong>Sugerencia:</strong> {errorInfo.suggestion}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Intentar Nuevamente
            </button>
            
            <Link 
              href="/"
              className="btn btn-secondary w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Link>
          </div>

          {/* Help text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-text-muted">
              Si el problema persiste, por favor contacta al administrador del sistema 
              con el código de error mostrado arriba.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}