import { AppLayout } from "@/components/layout/AppLayout"
import { Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Atletas",
  description: "Gestión completa de atletas registrados en el sistema deportivo, con información personal, deportiva y de tutores.",
}

export default function AthletesPage() {
  // Datos de ejemplo para mostrar la estructura
  const athletes = [
    {
      id: 1,
      fullName: "María González López",
      birthDate: "2010-05-15",
      age: 13,
      email: "maria.gonzalez@email.com",
      sport: "Natación",
      category: "Juvenil",
      venue: "Sede Norte",
      status: "Activo",
      hasGuardians: true
    },
    {
      id: 2,
      fullName: "Carlos Pérez Martín",
      birthDate: "1995-08-22",
      age: 28,
      email: "carlos.perez@email.com",
      sport: "Fútbol",
      category: "Adulto",
      venue: "Sede Centro",
      status: "Activo",
      hasGuardians: false
    },
    {
      id: 3,
      fullName: "Ana Rodríguez Silva",
      birthDate: "2008-11-03",
      age: 15,
      email: "ana.rodriguez@email.com",
      sport: "Baloncesto",
      category: "Cadete",
      venue: "Sede Sur",
      status: "Activo",
      hasGuardians: true
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Infantil":
        return "bg-blue-100 text-blue-800"
      case "Juvenil":
        return "bg-green-100 text-green-800"
      case "Cadete":
        return "bg-yellow-100 text-yellow-800"
      case "Adulto":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Atletas</h1>
            <p className="text-text-secondary">
              Gestión de atletas registrados en el sistema
            </p>
          </div>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Atleta
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="text-center">
              <p className="text-sm font-medium text-text-muted">Total Atletas</p>
              <p className="text-2xl font-bold text-text-primary">247</p>
            </div>
          </div>
          <div className="card">
            <div className="text-center">
              <p className="text-sm font-medium text-text-muted">Atletas Menores</p>
              <p className="text-2xl font-bold text-warning-600">89</p>
            </div>
          </div>
          <div className="card">
            <div className="text-center">
              <p className="text-sm font-medium text-text-muted">Atletas Adultos</p>
              <p className="text-2xl font-bold text-success-600">158</p>
            </div>
          </div>
          <div className="card">
            <div className="text-center">
              <p className="text-sm font-medium text-text-muted">Nuevos Este Mes</p>
              <p className="text-2xl font-bold text-primary-600">12</p>
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
                placeholder="Buscar atletas..."
                className="form-input pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <select className="form-input min-w-[140px]">
                <option value="">Todas las sedes</option>
                <option value="norte">Sede Norte</option>
                <option value="centro">Sede Centro</option>
                <option value="sur">Sede Sur</option>
              </select>
              
              <select className="form-input min-w-[140px]">
                <option value="">Todos los deportes</option>
                <option value="natacion">Natación</option>
                <option value="futbol">Fútbol</option>
                <option value="baloncesto">Baloncesto</option>
              </select>
              
              <button className="btn btn-secondary">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Athletes Table */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Atleta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Edad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Deporte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Sede
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
                {athletes.map((athlete) => (
                  <tr key={athlete.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-medium text-sm">
                            {athlete.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {athlete.fullName}
                          </p>
                          <p className="text-xs text-text-muted">
                            {athlete.email}
                          </p>
                          {athlete.hasGuardians && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800 mt-1">
                              Con tutores
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-primary">
                      {athlete.age} años
                    </td>
                    <td className="px-6 py-4 text-sm text-text-primary">
                      {athlete.sport}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(athlete.category)}`}>
                        {athlete.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {athlete.venue}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(athlete.status)}`}>
                        {athlete.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-text-muted hover:text-info-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-text-muted hover:text-warning-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-text-muted hover:text-error-600 transition-colors">
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
              Mostrando 1 a 3 de 247 atletas
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
                3
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}