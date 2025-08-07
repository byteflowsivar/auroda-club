import { Trophy, Users, BarChart3, Shield, CheckCircle, ArrowRight, Zap, Star } from "lucide-react"
import { SignInButton } from "@/components/auth/LoginButton"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                SGD
              </h1>
              <p className="text-sm text-gray-600 font-medium">Sistema Deportivo</p>
            </div>
          </div>

          {/* Navigation & Login */}
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Características
              </Link>
              <Link href="#benefits" className="text-gray-600 hover:text-blue-600 transition-colors">
                Beneficios
              </Link>
            </nav>
            <SignInButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-75"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Gestión Deportiva Moderna
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl lg:text-7xl mb-6">
              Gestiona tu{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                  club deportivo
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-blue-200 to-orange-200 rounded-full opacity-30"></div>
              </span>
              {' '}con excelencia
            </h1>
            
            <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
              La plataforma más completa para administrar atletas, tutores y actividades deportivas. 
              <span className="font-semibold text-gray-800">Digitaliza tu club</span> y mejora la experiencia de todos.
            </p>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SignInButton variant="primary" size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25" />
              <Link 
                href="#features"
                className="inline-flex items-center px-8 py-4 text-blue-600 bg-white border border-blue-200 rounded-xl font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-md"
              >
                Ver características
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-16 flex items-center justify-center space-x-8 text-gray-500">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-2 font-medium">Confiado por +50 clubes</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
              Todo lo que necesitas en una sola plataforma
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Herramientas diseñadas específicamente para el entorno deportivo, 
              con la tecnología más avanzada
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Gestión de Atletas */}
            <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Gestión de Atletas
              </h3>
              <p className="text-gray-600 mb-4">
                Registro completo con información personal, médica y deportiva. 
                Gestión automática de tutores para menores.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                <span>Ver más</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Disciplinas Deportivas */}
            <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Disciplinas
              </h3>
              <p className="text-gray-600 mb-4">
                Organiza deportes por categorías y edades. Asignación automática 
                según la edad del atleta.
              </p>
              <div className="flex items-center text-orange-600 font-semibold">
                <span>Ver más</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Reportes */}
            <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Reportes
              </h3>
              <p className="text-gray-600 mb-4">
                Estadísticas detalladas y reportes personalizables para 
                tomar decisiones informadas.
              </p>
              <div className="flex items-center text-green-600 font-semibold">
                <span>Ver más</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Control de Acceso */}
            <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Control de Acceso
              </h3>
              <p className="text-gray-600 mb-4">
                Roles diferenciados para administradores generales, de club y profesores. 
                Seguridad garantizada.
              </p>
              <div className="flex items-center text-purple-600 font-semibold">
                <span>Ver más</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                ¿Por qué elegir SGD?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Ahorra tiempo valioso</h3>
                    <p className="text-gray-600">Automatiza procesos repetitivos y enfócate en lo que realmente importa: tus atletas.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información organizada</h3>
                    <p className="text-gray-600">Todos los datos centralizados y accesibles desde cualquier dispositivo.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Seguridad garantizada</h3>
                    <p className="text-gray-600">Protección de datos con los más altos estándares de seguridad.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Fácil de usar</h3>
                    <p className="text-gray-600">Interfaz intuitiva que cualquier persona puede dominar en minutos.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-orange-100 rounded-3xl transform rotate-6"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-xl">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-gray-600 mb-6">Clubes deportivos confían en SGD</div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">1,200+</div>
                      <div className="text-sm text-gray-600">Atletas registrados</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">95%</div>
                      <div className="text-sm text-gray-600">Satisfacción</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-48 -translate-x-48"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white sm:text-5xl mb-6">
            ¿Listo para modernizar tu club?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Únete a los clubs deportivos que ya han transformado su gestión 
            con SGD. Es hora de dar el salto al futuro.
          </p>
          <SignInButton 
            variant="accent" 
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold">SGD</div>
                  <div className="text-gray-400">Sistema de Gestión Deportiva</div>
                </div>
              </div>
              <p className="text-gray-400 max-w-md">
                La plataforma más completa para la gestión moderna de clubes deportivos. 
                Digitaliza tu administración y mejora la experiencia de atletas y tutores.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Características</Link></li>
                <li><Link href="#benefits" className="hover:text-white transition-colors">Beneficios</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Documentación</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contacto</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Estado del sistema</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 SGD. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Política de Privacidad
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Términos de Servicio
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
