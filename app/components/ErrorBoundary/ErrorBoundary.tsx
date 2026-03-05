"use client";

import { Component, ReactNode } from "react";
import CustomButton from "../Shared/CustomButton/CustomButton";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-900 to-gray-800">
            <div className="text-center p-8 max-w-md">
              <h2 className="text-2xl font-bold text-white mb-4">
                😕 Что-то пошло не так
              </h2>
              <p className="text-gray-300 mb-6">
                Произошла ошибка при загрузке страницы. Пожалуйста, попробуйте
                обновить страницу.
              </p>
              <CustomButton
                label="Перезагрузить страницу"
                onClick={() => window.location.reload()}
              />
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
