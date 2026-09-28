import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, LogOut } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleLogout = () => {
    try {
      sessionStorage.removeItem('pump_admin_auth');
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[350px] p-6 sm:p-10 flex flex-col items-center justify-center text-center bg-[#0f0f0f] text-white rounded-2xl border border-red-900/40">
          <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500 mb-4 shadow-[0_0_25px_rgba(220,38,38,0.3)]">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {this.props.fallbackTitle || 'حدث خطأ غير متوقع أثناء عرض لوحة التحكم'}
          </h3>
          <p className="text-xs text-neutral-400 max-w-md mb-6 leading-relaxed">
            تم رصد خطأ أثناء معالجة عناصر لوحة التحكم. اضغط على زر إعادة المحاولة لاسترجاع البيانات أو تسجيل الخروج.
          </p>

          {this.state.error?.message && (
            <div className="mb-6 p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-red-400 font-mono text-[11px] max-w-lg overflow-x-auto text-left" dir="ltr">
              {this.state.error.message}
            </div>
          )}

          <div className="flex flex-wrap gap-3 items-center justify-center">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة المحاولة</span>
            </button>
            <button
              onClick={this.handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-neutral-700 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
