// 響應式設計工具
const ResponsiveUtils = {
    // 遊戲容器適配
    adaptGameContainer(container, options = {}) {
        const {
            maxWidth = 480,
            maxHeight = 640,
            padding = 20,
            aspectRatio = null
        } = options;
        
        const screen = MobileUtils.getScreenInfo();
        let width, height;
        
        if (aspectRatio) {
            // 固定長寬比適配
            width = Math.min(screen.width - padding * 2, maxWidth);
            height = width / aspectRatio;
            
            if (height > screen.height - padding * 2) {
                height = screen.height - padding * 2;
                width = height * aspectRatio;
            }
        } else {
            // 彈性適配
            width = Math.min(screen.width - padding * 2, maxWidth);
            height = Math.min(screen.height - padding * 2, maxHeight);
        }
        
        container.style.width = `${width}px`;
        container.style.height = `${height}px`;
        container.style.maxWidth = '100%';
        container.style.maxHeight = '100%';
        
        return { width, height };
    },
    
    // Canvas 適配
    adaptCanvas(canvas, container, options = {}) {
        const { maintainAspect = true, scale = 1 } = options;
        
        const containerRect = container.getBoundingClientRect();
        let width = containerRect.width;
        let height = containerRect.height;
        
        // 設定實際像素尺寸（考慮設備像素比）
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = width * pixelRatio * scale;
        canvas.height = height * pixelRatio * scale;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        // 縮放繪圖上下文
        const ctx = canvas.getContext('2d');
        ctx.scale(pixelRatio * scale, pixelRatio * scale);
        
        return { width, height, pixelRatio, scale };
    },
    
    // 計算適配的觸控按鈕位置
    calculateButtonPositions(screen, gameArea) {
        const { width: screenWidth, height: screenHeight } = screen;
        const { width: gameWidth, height: gameHeight } = gameArea;
        
        const buttonSize = Math.min(screenWidth, screenHeight) * 0.08;
        const margin = 10;
        
        return {
            // 方向鍵位置（右下角）
            directionPad: {
                bottom: margin + 50,
                right: margin,
                size: buttonSize,
                spacing: buttonSize * 0.15
            },
            // 動作按鈕位置（左下角）
            actionButton: {
                bottom: margin + 50,
                left: margin,
                size: buttonSize
            },
            // 暫停按鈕位置（上方中央）
            pauseButton: {
                top: margin + 10,
                left: '50%',
                transform: 'translateX(-50%)',
                size: buttonSize * 0.8
            }
        };
    },
    
    // 創建響應式文字
    createResponsiveText(baseSize, minSize = 12, maxSize = 24) {
        const screenWidth = window.innerWidth;
        const scaleFactor = Math.max(0.8, Math.min(1.2, screenWidth / 375));
        const fontSize = Math.min(maxSize, Math.max(minSize, baseSize * scaleFactor));
        
        return {
            fontSize: `${fontSize}px`,
            lineHeight: `${fontSize * 1.4}px`
        };
    }
};

// 導出
window.ResponsiveUtils = ResponsiveUtils;