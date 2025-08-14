'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logError } from '@/lib/error-handler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Llamar al callback personalizado si existe
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Manejar el error con nuestro sistema centralizado
    logError(error, 'Component Error', {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Si hay un fallback personalizado, usarlo
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback por defecto
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-red-900">¡Oops! Algo salió mal</CardTitle>
              <CardDescription>
                Se produjo un error inesperado en esta sección de la aplicación.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && (
                <details className="bg-gray-50 p-3 rounded border text-sm">
                  <summary className="cursor-pointer font-medium text-gray-700">
                    Detalles del error (solo en desarrollo)
                  </summary>
                  <div className="mt-2 space-y-2">
                    <div>
                      <strong>Error:</strong> {this.state.error?.message}
                    </div>
                    <div>
                      <strong>Stack:</strong>
                      <pre className="text-xs mt-1 overflow-auto">
                        {this.state.error?.stack}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="text-xs mt-1 overflow-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={this.handleRetry} 
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>
                <Button 
                  onClick={this.handleReload}
                  className="flex-1"
                >
                  Recargar Página
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper funcional para facilitar el uso
interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  context?: string;
}

export function ErrorBoundaryWrapper({ 
  children, 
  fallback, 
  context = 'Component' 
}: ErrorBoundaryWrapperProps) {
  return (
    <ErrorBoundary
      fallback={fallback}
      onError={(error, errorInfo) => {
        console.error(`Error in ${context}:`, error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// HOC para envolver componentes automáticamente
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  context?: string
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundaryWrapper fallback={fallback} context={context}>
      <Component {...props} />
    </ErrorBoundaryWrapper>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

export default ErrorBoundary;