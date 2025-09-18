import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen bg-gray-50 justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500">Something went wrong</h2>
            <p className="text-gray-600">{this.state.error?.message || "An error occurred"}</p>
            <a href="/" className="mt-4 inline-block px-4 py-2 bg-[#006a9a] text-white rounded hover:bg-[#00557a]">
              Return to Home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;