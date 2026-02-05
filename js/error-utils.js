/**
 * Global Error Handling Utility
 * Provides centralized error handling, logging, and user feedback
 */

const ErrorHandler = {
    // Configuration
    config: {
        showUserNotifications: true,
        logToConsole: true,
        sendToServer: false,
        serverEndpoint: '/api/errors',
        maxErrorsPerMinute: 10,
        errorHistorySize: 50
    },

    // State
    state: {
        errorCount: 0,
        lastErrorTime: 0,
        errorHistory: [],
        isInitialized: false
    },

    // Error types
    ErrorTypes: {
        RUNTIME: 'runtime',
        NETWORK: 'network',
        RESOURCE: 'resource',
        GAMEPLAY: 'gameplay',
        INPUT: 'input',
        PERFORMANCE: 'performance'
    },

    // Initialize error handling
    init: function(options = {}) {
        if (this.state.isInitialized) return;
        
        // Merge config
        this.config = { ...this.config, ...options };
        
        // Setup global error handlers
        this.setupGlobalHandlers();
        
        // Setup unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: this.ErrorTypes.RUNTIME,
                message: `Unhandled Promise Rejection: ${event.reason}`,
                stack: event.reason?.stack,
                severity: 'medium'
            });
        });
        
        this.state.isInitialized = true;
        console.log('ErrorHandler initialized');
    },

    // Setup global error handlers
    setupGlobalHandlers: function() {
        const originalOnError = window.onerror;
        window.onerror = (message, source, lineno, colno, error) => {
            this.handleError({
                type: this.ErrorTypes.RUNTIME,
                message: message.toString(),
                source: source,
                line: lineno,
                column: colno,
                stack: error?.stack,
                severity: 'high'
            });
            
            // Call original handler if exists
            if (typeof originalOnError === 'function') {
                return originalOnError(message, source, lineno, colno, error);
            }
            
            // Prevent default browser error handling
            return true;
        };
    },

    // Main error handling function
    handleError: function(errorInfo) {
        const {
            type = this.ErrorTypes.RUNTIME,
            message = 'Unknown error',
            stack = '',
            severity = 'medium',
            context = {},
            source = '',
            line = 0,
            column = 0
        } = errorInfo;

        // Rate limiting
        const now = Date.now();
        if (now - this.state.lastErrorTime < 60000 / this.config.maxErrorsPerMinute) {
            this.state.errorCount++;
            if (this.state.errorCount > this.config.maxErrorsPerMinute) {
                return; // Too many errors, skip
            }
        } else {
            this.state.errorCount = 1;
            this.state.lastErrorTime = now;
        }

        // Create error object
        const errorObj = {
            id: this.generateErrorId(),
            timestamp: new Date().toISOString(),
            type,
            message,
            severity,
            stack,
            source,
            line,
            column,
            context,
            userAgent: navigator.userAgent,
            url: window.location.href,
            platform: this.getPlatformInfo()
        };

        // Add to history
        this.state.errorHistory.unshift(errorObj);
        if (this.state.errorHistory.length > this.config.errorHistorySize) {
            this.state.errorHistory.pop();
        }

        // Log to console
        if (this.config.logToConsole) {
            this.logToConsole(errorObj);
        }

        // Show user notification
        if (this.config.showUserNotifications && severity === 'high') {
            this.showUserNotification(errorObj);
        }

        // Send to server
        if (this.config.sendToServer) {
            this.sendToServer(errorObj);
        }

        return errorObj;
    },

    // Generate unique error ID
    generateErrorId: function() {
        return 'err_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Get platform information
    getPlatformInfo: function() {
        return {
            screen: `${window.screen.width}x${window.screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            devicePixelRatio: window.devicePixelRatio,
            language: navigator.language,
            online: navigator.onLine,
            memory: navigator.deviceMemory || 'unknown',
            cores: navigator.hardwareConcurrency || 'unknown'
        };
    },

    // Log error to console with appropriate styling
    logToConsole: function(errorObj) {
        const styles = {
            high: 'background: #ff4444; color: white; padding: 2px 4px; border-radius: 3px;',
            medium: 'background: #ffaa00; color: black; padding: 2px 4px; border-radius: 3px;',
            low: 'background: #44aaff; color: white; padding: 2px 4px; border-radius: 3px;'
        };

        console.groupCollapsed(`%c${errorObj.type.toUpperCase()} ERROR: ${errorObj.message}`, styles[errorObj.severity] || styles.medium);
        console.log('Timestamp:', errorObj.timestamp);
        console.log('Severity:', errorObj.severity);
        console.log('Source:', errorObj.source || 'N/A');
        if (errorObj.line) console.log('Line:', errorObj.line);
        if (errorObj.column) console.log('Column:', errorObj.column);
        if (errorObj.stack) console.log('Stack:', errorObj.stack);
        if (Object.keys(errorObj.context).length > 0) console.log('Context:', errorObj.context);
        console.log('Platform:', errorObj.platform);
        console.groupEnd();
    },

    // Show user-friendly notification
    showUserNotification: function(errorObj) {
        // Check if notification already exists
        if (document.getElementById('global-error-notification')) return;

        const notification = document.createElement('div');
        notification.id = 'global-error-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff4444, #cc0000);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 99999;
            max-width: 350px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            border-left: 5px solid #ff8888;
            animation: slideIn 0.3s ease-out;
        `;

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // Create message based on error type
        let userMessage = 'An error occurred.';
        let suggestion = 'Try refreshing the page.';
        
        switch (errorObj.type) {
            case this.ErrorTypes.NETWORK:
                userMessage = 'Network connection issue.';
                suggestion = 'Check your internet connection.';
                break;
            case this.ErrorTypes.RESOURCE:
                userMessage = 'Failed to load resource.';
                suggestion = 'The game may not work properly.';
                break;
            case this.ErrorTypes.PERFORMANCE:
                userMessage = 'Performance issue detected.';
                suggestion = 'Try closing other tabs or applications.';
                break;
        }

        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 18px;">⚠️</span>
                <span>${userMessage}</span>
            </div>
            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 10px;">
                ${suggestion}
            </div>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button id="error-dismiss" style="
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 5px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    flex: 1;
                ">Dismiss</button>
                <button id="error-details" style="
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 5px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    flex: 1;
                ">Details</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Add event listeners
        notification.querySelector('#error-dismiss').addEventListener('click', () => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });

        notification.querySelector('#error-details').addEventListener('click', () => {
            this.showErrorDetails(errorObj);
            notification.remove();
        });

        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 10000);
    },

    // Show detailed error information
    showErrorDetails: function(errorObj) {
        // Create modal
        const modal = document.createElement('div');
        modal.id = 'error-details-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 25px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            color: #333;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        `;

        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px;">
                <h3 style="margin: 0; color: #ff4444;">Error Details</h3>
                <button id="close-modal" style="
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #666;
                ">×</button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <strong>Message:</strong> ${this.escapeHtml(errorObj.message)}
            </div>
            
            <div style="margin-bottom: 15px;">
                <strong>Type:</strong> <span style="background: #eee; padding: 2px 6px; border-radius: 3px;">${errorObj.type}</span>
                <strong style="margin-left: 15px;">Severity:</strong> <span style="background: #eee; padding: 2px 6px; border-radius: 3px;">${errorObj.severity}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
                <strong>Timestamp:</strong> ${errorObj.timestamp}
            </div>
            
            ${errorObj.source ? `<div style="margin-bottom: 15px;"><strong>Source:</strong> ${errorObj.source}</div>` : ''}
            ${errorObj.line ? `<div style="margin-bottom: 15px;"><strong>Location:</strong> Line ${errorObj.line}, Column ${errorObj.column}</div>` : ''}
            
            ${errorObj.stack ? `
                <div style="margin-bottom: 15px;">
                    <strong>Stack Trace:</strong>
                    <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; margin-top: 5px; font-size: 11px;">
${this.escapeHtml(errorObj.stack)}
                    </pre>
                </div>
            ` : ''}
            
            <div style="margin-bottom: 15px;">
                <strong>Context:</strong>
                <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; margin-top: 5px; font-size: 11px;">
${JSON.stringify(errorObj.context, null, 2)}
                </pre>
            </div>
            
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
                <div><strong>User Agent:</strong> ${navigator.userAgent}</div>
                <div><strong>URL:</strong> ${window.location.href}</div>
                <div><strong>Screen:</strong> ${errorObj.platform.screen}</div>
                <div><strong>Viewport:</strong> ${errorObj.platform.viewport}</div>
            </div>
            
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button id="copy-error" style="
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    flex: 1;
                ">Copy Error Info</button>
                <button id="report-error" style="
                    background: #2ecc71;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    flex: 1;
                ">Report Issue</button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('#close-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        modal.querySelector('#copy-error').addEventListener('click', () => {
            const errorText = JSON.stringify(errorObj, null, 2);
            navigator.clipboard.writeText(errorText).then(() => {
                const btn = modal.querySelector('#copy-error');
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                btn.style.background = '#2ecc71';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '#3498db';
                }, 2000);
            });
        });

        modal.querySelector('#report-error').addEventListener('click', () => {
            const errorText = JSON.stringify(errorObj, null, 2);
            const subject = encodeURIComponent(`Game Error Report: ${errorObj.type}`);
            const body = encodeURIComponent(`Error Details:\n\n${errorText}\n\nAdditional Information:\n`);
            window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
        });
    },

    // Escape HTML for safe display
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Send error to server
    sendToServer: function(errorObj) {
        if (!this.config.sendToServer || !this.config.serverEndpoint) return;

        fetch(this.config.serverEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(errorObj)
        }).catch(err => {
            console.warn('Failed to send error to server:', err);
        });
    },

    // Convenience methods for common error types
    handleGameplayError: function(message, context = {}) {
        return this.handleError({
            type: this.ErrorTypes.GAMEPLAY,
            message,
            context,
            severity: 'medium'
        });
    },

    handleNetworkError: function(message, context = {}) {
        return this.handleError({
            type: this.ErrorTypes.NETWORK,
            message,
            context,
            severity: 'high'
        });
    },

    handleResourceError: function(resourceUrl, context = {}) {
        return this.handleError({
            type: this.ErrorTypes.RESOURCE,
            message: `Failed to load resource: ${resourceUrl}`,
            context: { url: resourceUrl, ...context },
            severity: 'medium'
        });
    },

    handlePerformanceWarning: function(message, context = {}) {
        return this.handleError({
            type: this.ErrorTypes.PERFORMANCE,
            message,
            context,
            severity: 'low'
        });
    },

    // Get error history
    getErrorHistory: function() {
        return [...this.state.errorHistory];
    },

    // Clear error history
    clearErrorHistory: function() {
        this.state.errorHistory = [];
        this.state.errorCount = 0;
    },

    // Check if there are recent errors
    hasRecentErrors: function(minutes = 5) {
        const cutoff = Date.now() - (minutes * 60 * 1000);
        return this.state.errorHistory.some(error =>
            new Date(error.timestamp).getTime() > cutoff
        );
    },

    // Get error statistics
    getErrorStats: function() {
        const stats = {
            total: this.state.errorHistory.length,
            byType: {},
            bySeverity: {},
            recent: this.state.errorHistory.filter(err =>
                Date.now() - new Date(err.timestamp).getTime() < 3600000 // Last hour
            ).length
        };

        this.state.errorHistory.forEach(error => {
            stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
            stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
        });

        return stats;
    }
};
