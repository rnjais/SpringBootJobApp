import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error, info) { console.error('UI rendering error', error, info); }
  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="error-screen"><div className="error-icon"><AlertTriangle/></div><h1>That page hit a snag.</h1><p>Your work is safe. Try refreshing this view.</p><button className="button button-primary" onClick={() => this.setState({ failed: false })}><RotateCcw size={16}/> Try again</button></main>;
  }
}
