// 手機支援工具庫
const MobileUtils = {
    // 偵測是否為行動裝置
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (window.innerWidth <= 768 && 'ontouchstart' in window);
    },
    
    // 偵測是否為平板
    isTablet() {
        return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
    },
    
    // 取得安全的觸控位置
    getTouchPos(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.changedTouches && e.changedTouches.length > 0) {
            return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    },
    
    // 防止預設觸控行為
    preventDefaultTouch(e) {
        if (e.cancelable) e.preventDefault();
    },
    
    // 震動回饋 (若支援)
    vibrate(duration = 50) {
        if ('vibrate' in navigator) {
            navigator.vibrate(duration);
        }
    },
    
    // 取得裝置螢幕資訊
    getScreenInfo() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            isLandscape: window.innerWidth > window.innerHeight,
            isPortrait: window.innerHeight >= window.innerWidth,
            pixelRatio: window.devicePixelRatio || 1
        };
    },
    
    // 設定全螢幕
    async requestFullscreen(element = document.documentElement) {
        try {
            if (element.requestFullscreen) {
                await element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                await element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                await element.msRequestFullscreen();
            }
        } catch (error) {
            console.log('Fullscreen not supported or denied');
        }
    },
    
    // 離開全螢幕
    async exitFullscreen() {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                await document.msExitFullscreen();
            }
        } catch (error) {
            console.log('Error exiting fullscreen');
        }
    },
    
    // 偵測是否為全螢幕
    isFullscreen() {
        return !!(document.fullscreenElement || document.webkitFullscreenElement || 
                  document.msFullscreenElement);
    },
    
    // 監聽螢幕方向變化
    onOrientationChange(callback) {
        const handler = () => {
            setTimeout(callback, 100); // 延遲以取得正確的螢幕尺寸
        };
        window.addEventListener('orientationchange', handler);
        window.addEventListener('resize', handler);
        return handler;
    },
    
    // 移除螢幕方向監聽
    offOrientationChange(handler) {
        window.removeEventListener('orientationchange', handler);
        window.removeEventListener('resize', handler);
    },
    
    // 建立觸控按鈕
    createTouchButton(options = {}) {
        const {
            text = '',
            className = 'mobile-btn',
            size = { width: 60, height: 60 },
            position = { top: 0, left: 0 },
            onClick = () => {},
            onTouchStart = () => {},
            onTouchEnd = () => {}
        } = options;
        
        const btn = document.createElement('button');
        btn.className = className;
        btn.textContent = text;
        btn.style.cssText = `
            position: fixed;
            width: ${size.width}px;
            height: ${size.height}px;
            top: ${position.top}px;
            left: ${position.left}px;
            z-index: 1000;
            display: ${this.isMobile() ? 'flex' : 'none'};
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
            backdrop-filter: blur(5px);
            transition: all 0.1s ease;
        `;
        
        btn.addEventListener('click', onClick);
        btn.addEventListener('touchstart', (e) => {
            this.preventDefaultTouch(e);
            btn.style.transform = 'scale(0.95)';
            onTouchStart();
        }, { passive: false });
        
        btn.addEventListener('touchend', (e) => {
            this.preventDefaultTouch(e);
            btn.style.transform = 'scale(1)';
            onTouchEnd();
        }, { passive: false });
        
        return btn;
    },
    
    // 建立虛擬方向鍵
    createDirectionPad(options = {}) {
        const {
            position = { bottom: 30, right: 30 },
            size = 60,
            spacing = 10,
            onUp = () => {},
            onDown = () => {},
            onLeft = () => {},
            onRight = () => {}
        } = options;
        
        const container = document.createElement('div');
        container.className = 'direction-pad';
        container.style.cssText = `
            position: fixed;
            bottom: ${position.bottom}px;
            ${position.right !== undefined ? `right: ${position.right}px` : `left: ${position.left}px`};
            z-index: 1000;
            display: ${this.isMobile() ? 'grid' : 'none'};
            grid-template-columns: ${size}px ${size}px ${size}px;
            grid-template-rows: ${size}px ${size}px ${size}px;
            gap: ${spacing}px;
        `;
        
        // 方向按鈕位置
        const buttons = [
            { gridRow: 1, gridColumn: 2, text: '▲', action: onUp },
            { gridRow: 2, gridColumn: 1, text: '◀', action: onLeft },
            { gridRow: 2, gridColumn: 3, text: '▶', action: onRight },
            { gridRow: 3, gridColumn: 2, text: '▼', action: onDown }
        ];
        
        buttons.forEach(btn => {
            const btnEl = document.createElement('button');
            btnEl.style.cssText = `
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                font-size: 20px;
                cursor: pointer;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
                backdrop-filter: blur(5px);
                transition: all 0.1s ease;
            `;
            
            btnEl.textContent = btn.text;
            btnEl.style.gridColumn = btn.gridColumn;
            btnEl.style.gridRow = btn.gridRow;
            
            btnEl.addEventListener('touchstart', (e) => {
                this.preventDefaultTouch(e);
                btnEl.style.transform = 'scale(0.95)';
                this.vibrate(30);
                btn.action();
            }, { passive: false });
            
            btnEl.addEventListener('touchend', (e) => {
                this.preventDefaultTouch(e);
                btnEl.style.transform = 'scale(1)';
            }, { passive: false });
            
            container.appendChild(btnEl);
        });
        
        return container;
    },
    
    // 建立全螢幕按鈕
    createFullscreenButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '⛶';
        btn.title = '切換全螢幕';
        btn.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 1001;
            padding: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 20px;
            cursor: pointer;
            display: ${this.isMobile() ? 'flex' : 'none'};
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
            transition: all 0.2s ease;
        `;
        
        btn.addEventListener('click', () => {
            if (this.isFullscreen()) {
                this.exitFullscreen();
                btn.innerHTML = '⛶';
            } else {
                this.requestFullscreen();
                btn.innerHTML = '⛷';
            }
        });
        
        return btn;
    },
    
    // 偵測並套用手機樣式
    applyMobileStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 手機通用樣式 */
            @media (max-width: 768px) {
                * {
                    -webkit-tap-highlight-color: transparent;
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    user-select: none;
                }
                
                body {
                    overflow: hidden;
                    touch-action: none;
                }
                
                .mobile-only {
                    display: block !important;
                }
                
                .desktop-only {
                    display: none !important;
                }
            }
            
            @media (min-width: 769px) {
                .mobile-only {
                    display: none !important;
                }
                
                .desktop-only {
                    display: block !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// 自動套用手機樣式
MobileUtils.applyMobileStyles();

// 導出
window.MobileUtils = MobileUtils;