import { AdminLayout } from "@/components/layout/AppLayout"
import { Shield, Plus, Search, Filter, Eye, Edit, Trash2, UserCheck, UserX } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Usuarios",
  description: "Administración de usuarios y permisos del sistema. Acceso exclusivo para administradores generales.",
}

export default function UsersPage() {
  // Esta página solo debe ser accesible para ADMIN_GENERAL
  // Datos de ejemplo para mostrar la estructura
  const users = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@sgd.com",
      roles: ["ADMIN_CLUB"],
      clubId: "CLUB_001",
      venueIds: ["SEDE_001", "SEDE_002"],
      status: "Activo",
      lastLogin: "2025-01-07"
    },
    {
      id: 2,
      name: "María González",
      email: "maria.gonzalez@sgd.com",
      roles: ["PROFESOR"],
      clubId: "CLUB_001", 
      sportIds: ["NATACION"],
      status: "Activo",
      lastLogin: "2025-01-06"
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@sgd.com",
      roles: ["ADMIN_GENERAL"],
      clubId: null,
      status: "Activo",
      lastLogin: "2025-01-07"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-success-100 text-success-800"
      case "Inactivo":
        return "bg-gray-100 text-gray-800"
      case "Suspendido":
        return "bg-error-100 text-error-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN_GENERAL":
        return "bg-purple-100 text-purple-800"
      case "ADMIN_CLUB":
        return "bg-blue-100 text-blue-800"
      case "PROFESOR":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "ADMIN_GENERAL":
        return "Admin General"
      case "ADMIN_CLUB":
        return "Admin Club"
      case "PROFESOR":
        return "Profesor"
      default:
        return role
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Usuarios</h1>
            <p className="text-text-secondary">
              Gestión de usuarios y permisos del sistema
            </p>
          </div>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </button>
        </div>

        {/* Warning banner */}
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-warning-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-warning-800">
                Área de Administración del Sistema
              </p>
              <p className="text-xs text-warning-700">
                Esta sección está disponible únicamente para administradores generales. 
                Los cambios aquí realizados afectan el acceso de todos los usuarios.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="text-center">
              <p className="text-sm font-medium text-text-muted">Total Usuarios</p>
              <p className="text-2xl font-bold text-text-primary">47</p>
            </div>
          </div>
          <div className="card">
            <div className="text-center">
              <p className="text-sm font-medium text-text-muted">Admin General</p>
              <p className="text-2xl font-bold text-purple-600">3</p>
            </div>
          </div>
          <div className="card">
            <div className="text-center">
              <p className="text-sm font-medium text-text-muted">Admin Club</p>
              <p className="text-2xl font-bold text-blue-600">8</p>
            </div>
          </div>
          <div className="card">
            <div className="text-center">
              <p className="text-sm font-medium text-text-muted">Profesores</p>
              <p className="text-2xl font-bold text-green-600">36</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                className="form-input pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <select className="form-input min-w-[140px]">
                <option value="">Todos los roles</option>
                <option value="ADMIN_GENERAL">Admin General</option>
                <option value="ADMIN_CLUB">Admin Club</option>
                <option value="PROFESOR">Profesor</option>
              </select>
              
              <select className="form-input min-w-[140px]">
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="suspendido">Suspendido</option>
              </select>
              
              <button className="btn btn-secondary">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Asignaciones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Último Acceso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-medium text-sm">
                            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {user.name}
                          </p>
                          <p className="text-xs text-text-muted">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(role)}`}
                          >
                            {getRoleDisplayName(role)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      <div className="space-y-1">
                        {user.clubId && (
                          <div className="text-xs">Club: {user.clubId}</div>
                        )}
                        {user.venueIds && (
                          <div className="text-xs">Sedes: {user.venueIds.join(', ')}</div>
                        )}
                        {user.sportIds && (
                          <div className="text-xs">Deportes: {user.sportIds.join(', ')}</div>
                        )}
                        {!user.clubId && !user.venueIds && !user.sportIds && (
                          <div className="text-xs text-text-muted">Sin asignaciones</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 text-text-muted hover:text-info-600 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-text-muted hover:text-warning-600 transition-colors"
                          title="Editar usuario"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {user.status === "Activo" ? (
                          <button 
                            className="p-1 text-text-muted hover:text-warning-600 transition-colors"
                            title="Suspender usuario"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            className="p-1 text-text-muted hover:text-success-600 transition-colors"
                            title="Activar usuario"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          className="p-1 text-text-muted hover:text-error-600 transition-colors"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-text-muted">
              Mostrando 1 a 3 de 47 usuarios
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                Anterior
              </button>
              <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}