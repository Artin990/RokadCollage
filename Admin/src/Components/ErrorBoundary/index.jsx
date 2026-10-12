import React, { Component } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Button from "../UI/Button";

/**
 * Google-Grade ErrorBoundary
 * Prevents runtime render exceptions from causing blank white screens.
 * Provides a graceful, accessible Persian recovery card with reload options.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log error to console for monitoring / diagnostics
    console.error("ErrorBoundary caught an unhandled render error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetError: this.handleReset,
        });
      }

      const isDev = import.meta.env.DEV;

      return (
        <div
          dir="rtl"
          role="alert"
          aria-live="assertive"
          className="min-h-[420px] w-full flex items-center justify-center p-4 sm:p-6 my-auto"
        >
          <div className="w-full max-w-lg bg-surface rounded-3xl border border-error/30 shadow-xl p-6 sm:p-8 text-center flex flex-col items-center gap-4 animate-fadeIn">
            {/* Warning Icon Container */}
            <div className="w-16 h-16 rounded-2xl bg-error-light text-error border border-error-border flex items-center justify-center shadow-xs">
              <WarningAmberRoundedIcon style={{ fontSize: "2rem" }} />
            </div>

            {/* Error Headlines */}
            <div className="flex flex-col gap-1.5">
              <h2 className="text-lg sm:text-xl font-black text-secondary">
                {this.props.title || "متأسفانه در بارگذاری این بخش خطایی رخ داد"}
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-sm mx-auto font-medium">
                ارتباط کامپوننت با داده‌ها دچار مشکل موقت شد. لطفاً دوباره تلاش کنید یا به داشبورد بازگردید.
              </p>
            </div>

            {/* Developer Details in DEV mode */}
            {isDev && this.state.error && (
              <details className="w-full text-right bg-bg-light/80 p-3 rounded-xl border border-border text-2xs text-error font-mono overflow-x-auto hide-scrollbar select-text mt-1">
                <summary className="font-bold text-text-secondary cursor-pointer select-none mb-1">
                  جزئیات فنی خطا (محیط توسعه):
                </summary>
                <p className="whitespace-pre-wrap">{this.state.error.toString()}</p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="mt-2 text-text-muted whitespace-pre-wrap overflow-x-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 w-full pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={this.handleReset}
                icon={<RefreshIcon fontSize="small" />}
                className="w-full sm:w-auto"
              >
                تلاش مجدد
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={this.handleGoHome}
                icon={<HomeOutlinedIcon fontSize="small" />}
                className="w-full sm:w-auto"
              >
                بازگشت به داشبورد
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
