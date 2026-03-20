# [Jayden]'s Game Center PRD

## 基本資訊
- 網站名稱：Jayden's Game Center
- 設計風格：深色科技感 / 明亮可愛風 / 簡約現代
- 主色調：深藍 #1e3a5f + 金色 #ffd700
- 語言：繁體中文
- 主題模式：黑暗模式與明亮模式切換

## 遊戲列表

### 單人挑戰 (SOLO)
1. **經典貪食蛇 (Cyber Snake)** - 最純粹的挑戰，在方寸之間考驗反應。吃掉蘋果，讓你的蛇成為王者。
   - 檔案：`game1.html`
   - 類型：經典、休閒
   - 特色：三種難度模式、網格背景、科技感介面
   - 標籤：🐍 經典、休閒

2. **Flappy Plane NYC Edition** - 控制笨拙的小鳥穿越水管，只需點擊，卻讓人欲罷不能的高難度挑戰。
   - 檔案：`game2.html`
   - 類型：動作、高難度
   - 特色：紐約地標背景、波音757飛機造型、像素風格
   - 標籤：🐦 動作、高難度

3. **Block Blast** - 極簡風格的積木消除遊戲，放置方塊填滿行列，放鬆心情釋放壓力。
   - 檔案：`game3.html`
   - 類型：益智、放鬆
   - 特色：拖放操作、多種形狀、漸變背景
   - 標籤：❒ 益智、放鬆

4. **Creative Hand Particle System** - 使用手部追蹤控制粒子系統，創造美麗的視覺效果。
   - 檔案：`game4.html`
   - 類型：創意、互動
   - 特色：MediaPipe手部追蹤、Three.js粒子系統、多種形狀切換
   - 標籤：👐 創意、互動

5. **Stark Industries Combat Sim - Dual Wield** - 史塔克工業戰鬥模擬，雙手開火對抗恐怖分子。
   - 檔案：`game5.html`
   - 類型：動作、射擊
   - 特色：手部追蹤射擊、雙手持槍、裝甲系統
   - 標籤：🦾 動作、射擊

6. **刺殺國王 (Murder: Among Us)** - 扮演 Impostor 刺殺國王奪取王位，但要小心別被發現！一旦成為國王，記得隨時回頭抓出背叛者。
   - 檔案：`game6.html`
   - 類型：反應、策略
   - 特色：Among Us風格、角色互換、監獄場景
   - 標籤：🔪 反應、策略

### 雙人對戰 (VS MODE)
1. **乒乓對決 (Ping Pong)** - 經典的雙人彈球遊戲。與朋友在同一鍵盤上分出高下！(即將推出)
   - 檔案：開發中
   - 類型：競技、雙人
   - 特色：本地對戰、簡單控制
   - 標籤：🏓 競技、雙人

## 頁面結構

### Header
- 網站標題：Jayden's Game Center
- 簡短 slogan：LEVEL UP YOUR BOREDOM | 升級你的無聊時光
- 主題切換按鈕：🌙 Dark Mode / ☀️ Light Mode

### 遊戲卡片區
每張卡片包含：
- 遊戲圖示 (Emoji)
- 遊戲名稱 (中英文)
- 簡短描述 (一句話)
- 開始按鈕 / 連結
- 遊戲標籤 (類型標籤)

### Footer
- 版權資訊：© 2026 [Jayden]'s Game Center. All rights reserved.
- 開發者名稱：[Jayden]
- 聯絡資訊：(可選)

## 技術規格

### 前端技術
- HTML5、CSS3、JavaScript (ES6+)
- Three.js (3D圖形)
- MediaPipe (手部追蹤)
- 響應式設計 (RWD)

### 主題系統
- CSS變數實現主題切換
- 預設：明亮模式 (淺色背景)
- 切換：黑暗模式 (深色背景)
- 本地儲存主題偏好

### 檔案結構
```
c:/Users/Mac/Desktop/test/test1/
├── index.html          # 主頁面
├── game1.html          # 貪食蛇
├── game2.html          # Flappy Plane
├── game3.html          # Block Blast
├── game4.html          # 手部粒子系統
├── game5.html          # 史塔克戰鬥模擬
├── game6.html          # 刺殺國王
├── PRD.md              # 專案需求文件
├── README.md           # 說明文件
├── js/                 # JavaScript工具
│   ├── error-utils.js
│   ├── mobile-utils.js
│   ├── performance-utils.js
│   └── responsive-utils.js
└── lib/                # 第三方庫
    ├── camera_utils.js
    ├── control_utils.js
    ├── drawing_utils.js
    ├── hands.js
    └── three.min.js
```

## 設計規範

### 色彩系統
- **主色調**：深藍 #1e3a5f + 金色 #ffd700
- **輔助色**：
  - 科技藍：#00d2ff
  - 警示紅：#e74c3c
  - 成功綠：#2ecc71
  - 中性灰：#7f8c8d

### 明亮模式
```css
:root {
    --bg-color: #f9f9f7;
    --card-bg: #ffffff;
    --text-main: #2c3e50;
    --text-sub: #7f8c8d;
    --accent-blue: #00d2ff;
    --shadow: 0 10px 20px rgba(0,0,0,0.05);
    --title-color: #0072ff;
}
```

### 黑暗模式
```css
[data-theme="dark"] {
    --bg-color: #121212;
    --card-bg: #1e1e1e;
    --text-main: #e0e0e0;
    --text-sub: #a0a0a0;
    --accent-blue: #38bdf8;
    --shadow: 0 10px 30px rgba(0,0,0,0.5);
    --title-color: #d500f9;
}
```

### 字體系統
- 標題字體：'Righteous', cursive
- 正文字體：'Poppins', 'Noto Sans TC', sans-serif
- 程式碼字體：'Consolas', 'Monaco', 'Courier New', monospace

## 功能需求

### 核心功能
1. **遊戲目錄瀏覽**：分類顯示所有遊戲
2. **主題切換**：黑暗/明亮模式即時切換
3. **響應式設計**：支援手機、平板、桌面裝置
4. **遊戲啟動**：一鍵進入遊戲頁面

### 進階功能
1. **遊戲進度儲存**：使用localStorage儲存高分紀錄
2. **手部追蹤支援**：部分遊戲支援手勢控制
3. **效能優化**：根據裝置效能調整畫質
4. **離線存取**：PWA支援 (未來規劃)

## 使用者體驗

### 桌面體驗
- 網格佈局顯示遊戲卡片
- 懸停效果：卡片上浮、邊框發光
- 平滑過渡動畫

### 行動體驗
- 單欄佈局
- 觸控友善介面
- 虛擬控制按鈕 (遊戲內)

### 無障礙設計
- 適當的色彩對比度
- 鍵盤導航支援
- 螢幕閱讀器友善

## 開發時程

### 第一階段 (已完成)
- [x] 基礎網站架構
- [x] 6款核心遊戲開發
- [x] 主題切換系統
- [x] 響應式設計

### 第二階段 (規劃中)
- [ ] 雙人對戰遊戲開發
- [ ] 使用者帳號系統
- [ ] 遊戲排行榜
- [ ] 社交分享功能

### 第三階段 (未來規劃)
- [ ] PWA離線支援
- [ ] 多語言支援
- [ ] 遊戲成就系統
- [ ] 雲端存檔同步

## 品質保證

### 測試項目
1. **跨瀏覽器測試**：Chrome、Firefox、Safari、Edge
2. **裝置測試**：手機、平板、桌面
3. **效能測試**：FPS監控、記憶體使用
4. **功能測試**：所有遊戲功能驗證

### 效能指標
- 首次載入時間：< 3秒
- 遊戲啟動時間：< 1秒
- 主題切換時間：< 300ms
- 60FPS遊戲體驗

## 維護與更新

### 定期維護
- 每月檢查第三方庫更新
- 每季效能優化
- 每年設計更新

### 錯誤回報
- 使用者回報機制
- 自動錯誤追蹤
- 快速修復流程

## 結語

Jayden's Game Center 是一個集合多種遊戲類型的網頁遊戲平台，從經典的貪食蛇到創新的手部追蹤遊戲，提供豐富的遊戲體驗。網站採用現代化的設計，支援黑暗/明亮主題切換，並針對各種裝置進行優化。

未來將持續擴充遊戲庫，並加入更多社交和競技功能，打造更完整的遊戲社群平台。

---
**最後更新**：2026年2月5日  
**版本**：1.0.0  
**狀態**：開發中  
**負責人**：Jayden