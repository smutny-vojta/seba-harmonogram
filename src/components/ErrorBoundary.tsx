import React from "react";
import ErrorComponent from "./ErrorComponent";

class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
}> {
  state = { hasError: false, error: { message: "" } };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo): void {}

  render() {
    if (this.state.hasError) {
      return <ErrorComponent message={this.state.error.message} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
