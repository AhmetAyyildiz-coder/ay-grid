import  { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Grid error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="grid-error-boundary">
                    <h2>Bir hata oluştu</h2>
                    <details>
                        <summary>Hata detayları</summary>
                        {this.state.error?.message}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}