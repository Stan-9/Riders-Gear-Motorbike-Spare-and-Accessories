import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-morning text-jade-dark flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-jade/5 rounded-[2.5rem] p-10 text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-jade-dark mb-3 tracking-tight">Something went wrong</h1>
            <p className="text-pebble font-bold opacity-70 text-sm leading-relaxed mb-8">
              An unexpected error occurred. Your data is safe. Please refresh the page to continue.
            </p>
            {this.state.error && (
              <pre className="text-left text-[10px] bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-8 overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-jade hover:bg-jade-dark text-white font-black px-8 py-4 rounded-2xl flex items-center gap-2 mx-auto transition transform hover:-translate-y-0.5 shadow-lg shadow-jade/20"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
