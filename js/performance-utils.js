// 手機效能優化工具
const PerformanceOptimizer = {
    // 偵測裝置效能等級
    detectPerformanceLevel() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        let performanceScore = 0;
        
        // GPU 偵測
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                // 根據 GPU 型號給分
                if (renderer.includes('Adreno 7') || renderer.includes('Apple A')) {
                    performanceScore += 3;
                } else if (renderer.includes('Adreno 6') || renderer.includes('Mali-G7')) {
                    performanceScore += 2;
                } else {
                    performanceScore += 1;
                }
            }
        }
        
        // CPU 核心數
        const cores = navigator.hardwareConcurrency || 4;
        performanceScore += Math.min(3, cores / 4);
        
        // 記憶體（如果支援）
        if (navigator.deviceMemory) {
            performanceScore += Math.min(3, navigator.deviceMemory / 4);
        }
        
        // 根據總分決定效能等級
        if (performanceScore >= 6) return 'high';
        if (performanceScore >= 4) return 'medium';
        return 'low';
    },
    
    // 針對不同效能等級的設定
    getOptimizedSettings(gameName) {
        const level = this.detectPerformanceLevel();
        const baseSettings = {
            particleCount: { high: 25000, medium: 15000, low: 8000 },
            updateFPS: { high: 60, medium: 45, low: 30 },
            visualEffects: { 
                high: { shadows: true, glow: true, particles: true },
                medium: { shadows: false, glow: true, particles: true },
                low: { shadows: false, glow: false, particles: false }
            }
        };
        
        // 特定遊戲的額外設定
        const gameSpecificSettings = {
            'game4': { // 量子粒子系統
                particleMultiplier: { high: 1.0, medium: 0.6, low: 0.3 },
                shapeComplexity: { high: 5, medium: 3, low: 2 }
            },
            'game5': { // 史塔克戰鬥模擬
                maxEnemies: { high: 8, medium: 6, low: 4 },
                effectIntensity: { high: 1.0, medium: 0.7, low: 0.5 }
            }
        };
        
        const settings = {
            level,
            ...baseSettings,
            ...(gameSpecificSettings[gameName] || {})
        };
        
        // 套用裝置特定調整
        if (MobileUtils.isTablet()) {
            // 平板效能通常更好
            settings.particleCount = {
                high: settings.particleCount.high * 1.2,
                medium: settings.particleCount.medium * 1.1,
                low: settings.particleCount.low
            };
        }
        
        return settings;
    },
    
    // 智能幀率控制
    createFrameController(targetFPS = 60) {
        let lastTime = 0;
        const frameInterval = 1000 / targetFPS;
        
        return {
            shouldUpdate: (currentTime) => {
                const elapsed = currentTime - lastTime;
                if (elapsed >= frameInterval) {
                    lastTime = currentTime - (elapsed % frameInterval);
                    return true;
                }
                return false;
            },
            
            // 動態調整目標幀率
            adjustTargetFPS: (performanceScore) => {
                if (performanceScore < 0.7) return Math.max(30, targetFPS * 0.8);
                if (performanceScore > 0.9) return Math.min(60, targetFPS * 1.1);
                return targetFPS;
            }
        };
    },
    
    // 記憶體管理
    memoryManager: {
        cache: new Map(),
        
        // 快取資源
        cacheResource(key, resource, maxSize = 100) {
            if (this.cache.size >= maxSize) {
                // 清理最舊的快取
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
            this.cache.set(key, resource);
            return resource;
        },
        
        // 取得快取資源
        getResource(key) {
            return this.cache.get(key);
        },
        
        // 清理快取
        clearCache() {
            this.cache.clear();
            // 強制垃圾回收（如果支援）
            if (window.gc) {
                window.gc();
            }
        },
        
        // 監控記憶體使用
        monitorMemory() {
            if (performance.memory) {
                const memory = performance.memory;
                return {
                    used: Math.round(memory.usedJSHeapSize / 1048576),
                    total: Math.round(memory.totalJSHeapSize / 1048576),
                    limit: Math.round(memory.jsHeapSizeLimit / 1048576),
                    usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100).toFixed(1)
                };
            }
            return null;
        }
    },
    
    // 圖片預載入與快取
    async preloadImages(urls) {
        const promises = urls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = url;
            });
        });
        
        try {
            const images = await Promise.all(promises);
            images.forEach((img, index) => {
                this.memoryManager.cacheResource(urls[index], img);
            });
            return images;
        } catch (error) {
            console.warn('Failed to preload some images:', error);
            return [];
        }
    },
    
    // 離開頁面時清理資源
    setupCleanupHandlers() {
        const cleanup = () => {
            // 清理動畫
            requestAnimationFrame = () => {};
            // 清理事件監聽器
            window.removeEventListener('visibilitychange', cleanup);
            window.removeEventListener('pagehide', cleanup);
        };
        
        // 頁面不可見時清理
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // 暫停遊戲，降低CPU使用
                this.memoryManager.clearCache();
            }
        });
        
        // 頁面卸載時清理
        window.addEventListener('pagehide', cleanup);
    }
};

// 導出
window.PerformanceOptimizer = PerformanceOptimizer;