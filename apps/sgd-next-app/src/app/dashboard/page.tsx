import { AppLayout } from "@/components/layout/AppLayout"
import { Users, UserCheck, Trophy, MapPin, TrendingUp, Calendar, AlertTriangle, CheckCircle } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Panel principal del Sistema de Gestión Deportiva con resumen de actividades, estadísticas y accesos rápidos.",
}

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
          <p className="text-text-secondary">
            Resumen general de la actividad del sistema deportivo
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Atletas Activos */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">Atletas Activos</p>
                <p className="text-3xl font-bold text-text-primary">247</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-success-600 mr-1" />
                  <span className="text-sm text-success-600 font-medium">+12 este mes</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{width: '68%'}}></div>
            </div>
          </div>

          {/* Tutores Registrados */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">Tutores Registrados</p>
                <p className="text-3xl font-bold text-text-primary">89</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-success-600 mr-1" />
                  <span className="text-sm text-success-600 font-medium">+5 este mes</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-accent-600" />
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-accent-500 h-2 rounded-full" style={{width: '45%'}}></div>
            </div>
          </div>

          {/* Disciplinas Activas */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">Disciplinas Activas</p>
                <p className="text-3xl font-bold text-text-primary">8</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-text-muted">Sin cambios</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-success-600" />
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-success-500 h-2 rounded-full" style={{width: '100%'}}></div>
            </div>
          </div>

          {/* Sedes Operativas */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">Sedes Operativas</p>
                <p className="text-3xl font-bold text-text-primary">4</p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="w-4 h-4 text-success-600 mr-1" />
                  <span className="text-sm text-success-600 font-medium">Todas activas</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-info-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-info-600" />
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-info-500 h-2 rounded-full" style={{width: '100%'}}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actividad Reciente */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">Actividad Reciente</h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Ver todo
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  type: 'athlete',
                  icon: Users,
                  title: 'Nuevo atleta registrado',
                  description: 'María González se registró en Natación',
                  time: 'Hace 2 horas',
                  color: 'bg-primary-100 text-primary-600'
                },
                {
                  type: 'guardian',
                  icon: UserCheck,
                  title: 'Tutor actualizado',
                  description: 'Carlos Pérez actualizó información de contacto',
                  time: 'Hace 4 horas',
                  color: 'bg-accent-100 text-accent-600'
                },
                {
                  type: 'athlete',
                  icon: Users,
                  title: 'Atleta transferido',
                  description: 'Ana Martín cambió de categoría',
                  time: 'Hace 1 día',
                  color: 'bg-warning-100 text-warning-600'
                },
                {
                  type: 'system',
                  icon: CheckCircle,
                  title: 'Backup completado',
                  description: 'Respaldo automático del sistema ejecutado',
                  time: 'Hace 2 días',
                  color: 'bg-success-100 text-success-600'
                }
              ].map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">
                        {activity.title}
                      </p>
                      <p className="text-sm text-text-muted">
                        {activity.description}
                      </p>
                      <p className="text-xs text-text-light mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Próximas tareas */}
            <div className="card">
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                Próximas Tareas
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-warning-50 border border-warning-200">
                  <AlertTriangle className="w-5 h-5 text-warning-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-warning-800">Revisión mensual</p>
                    <p className="text-xs text-warning-600">Vence en 3 días</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-info-50 border border-info-200">
                  <Calendar className="w-5 h-5 text-info-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-info-800">Backup semanal</p>
                    <p className="text-xs text-info-600">Programado para mañana</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accesos rápidos */}
            <div className="card">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Accesos Rápidos
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Users className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                  <span className="text-xs font-medium text-text-primary">Nuevo Atleta</span>
                </button>
                <button className="p-3 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <UserCheck className="w-6 h-6 mx-auto mb-2 text-accent-600" />
                  <span className="text-xs font-medium text-text-primary">Nuevo Tutor</span>
                </button>
                <button className="p-3 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-success-600" />
                  <span className="text-xs font-medium text-text-primary">Disciplinas</span>
                </button>
                <button className="p-3 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <MapPin className="w-6 h-6 mx-auto mb-2 text-info-600" />
                  <span className="text-xs font-medium text-text-primary">Sedes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}