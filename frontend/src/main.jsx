import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
class DebugBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, background: 'black', color: 'red', fontFamily: 'monospace' }}>
          <h2>CRASH</h2>
          <pre>{this.state.error.stack || this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DebugBoundary>
      <App />
    </DebugBoundary>
  </React.StrictMode>
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/job-tracker-sw.js').catch(() => {
      // Offline support should never block the main app from rendering.
    })
  })
}
