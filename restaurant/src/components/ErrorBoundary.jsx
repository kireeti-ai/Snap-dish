import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // This lifecycle method is used to render a fallback UI after an error has been thrown.
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  // This lifecycle method is used for logging error information.
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service like Sentry, LogRocket, etc.
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // If an error occurred, render the fallback UI.
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <h1 style={styles.title}>Something went wrong.</h1>
          <p style={styles.message}>We're sorry for the inconvenience. Please try refreshing the page.</p>
          {/* Optionally, display the error message during development */}
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
            </details>
          )}
        </div>
      );
    }

    // Normally, just render the children components.
    return this.props.children;
  }
}

// Basic styling for the fallback UI
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f4f7f6',
        padding: '20px'
    },
    title: {
        fontSize: '2rem',
        color: '#e74c3c'
    },
    message: {
        fontSize: '1.2rem',
        color: '#34495e'
    }
}


export default ErrorBoundary;