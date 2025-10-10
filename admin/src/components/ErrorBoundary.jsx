import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-content">
                        <h1>Something went wrong</h1>
                        <p>{this.state.error?.message}</p>
                        {process.env.NODE_ENV === 'development' && (
                            <details style={{ whiteSpace: 'pre-wrap' }}>
                                {this.state.error?.toString()}
                                <br />
                                {this.state.errorInfo?.componentStack}
                            </details>
                        )}
                        <button 
                            className="refresh-button"
                            onClick={() => window.location.reload()}
                        >
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