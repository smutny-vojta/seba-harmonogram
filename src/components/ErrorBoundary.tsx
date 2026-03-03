import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import ErrorComponent from "./ErrorComponent";

class ErrorBoundary extends React.Component<{
  fallback: React.ReactNode;
  children: React.ReactNode;
}> {
  state = { hasError: false, error: { message: "" } };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorComponent message={this.state.error.message} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
