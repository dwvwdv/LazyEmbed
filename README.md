# LazyEmbed - 小工具管理平台

LazyEmbed 是一個輕量級的靜態網頁專案，用於建立、管理和嵌入各種網頁小工具。透過簡潔的管理介面，您可以輕鬆建立自訂小工具並將其嵌入到任何網站。

## 功能特點

- **直覺的管理介面** - 簡單易用的網頁介面，輕鬆管理所有小工具
- **多種小工具類型** - 支援 iFrame、JavaScript、HTML 片段和自訂小工具
- **即時預覽** - 即時查看小工具效果
- **一鍵複製嵌入代碼** - 自動生成嵌入代碼，一鍵複製
- **本地儲存** - 使用 localStorage 儲存，無需後端
- **響應式設計** - 完美適配桌面和行動裝置
- **完全靜態** - 純前端實作，可部署到任何靜態託管服務

## 專案結構

```
LazyEmbed/
├── index.html              # 主管理頁面
├── wrangler.toml          # Cloudflare Workers 配置
├── css/
│   └── style.css          # 樣式檔案
├── js/
│   └── app.js             # 應用程式邏輯
├── src/
│   └── worker.js          # Cloudflare Worker 腳本
├── widgets/               # 範例小工具
│   ├── example-clock.html    # 時鐘小工具
│   ├── example-counter.html  # 計數器小工具
│   └── example-weather.html  # 天氣小工具
└── README.md
```

## 快速開始

### 1. 本地運行

直接在瀏覽器中打開 `index.html` 即可使用管理介面。

或使用本地伺服器：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx http-server

# 使用 PHP
php -S localhost:8000
```

然後在瀏覽器訪問 `http://localhost:8000`

### 2. 建立小工具

1. 點擊「新增小工具」按鈕
2. 填寫小工具資訊：
   - **名稱**：小工具的顯示名稱
   - **類型**：選擇小工具類型
   - **描述**：簡單描述功能（選填）
   - **嵌入代碼**：輸入 URL 或代碼
   - **尺寸**：設定寬度和高度（選填）
3. 點擊「儲存」

### 3. 嵌入小工具

1. 在小工具卡片上點擊「嵌入」按鈕
2. 複製生成的嵌入代碼
3. 將代碼貼到您的網站中

## 小工具類型

### iFrame 嵌入

適用於嵌入外部網頁或應用程式。

**範例**：
```
嵌入代碼：https://example.com/widget
```

### JavaScript 腳本

適用於第三方 JavaScript 小工具。

**範例**：
```
嵌入代碼：https://example.com/widget.js
```

### HTML 片段

適用於自訂 HTML 內容。

**範例**：
```html
<div style="text-align: center;">
  <h2>歡迎使用 LazyEmbed</h2>
  <p>這是一個 HTML 小工具</p>
</div>
```

### 自訂小工具

適用於完全自訂的小工具內容。

## 範例小工具

專案包含三個範例小工具，位於 `widgets/` 資料夾：

### 1. 時鐘小工具 (`example-clock.html`)

即時顯示時間和日期的美觀時鐘。

**嵌入方式**：
```html
<iframe src="widgets/example-clock.html" width="400" height="300" frameborder="0"></iframe>
```

### 2. 計數器小工具 (`example-counter.html`)

互動式計數器，支援增加、減少和重置功能。

**嵌入方式**：
```html
<iframe src="widgets/example-counter.html" width="400" height="400" frameborder="0"></iframe>
```

### 3. 天氣小工具 (`example-weather.html`)

展示天氣資訊的美觀卡片（範例資料）。

**嵌入方式**：
```html
<iframe src="widgets/example-weather.html" width="400" height="500" frameborder="0"></iframe>
```

## 部署

LazyEmbed 是完全靜態的專案，可以部署到任何靜態託管服務：

### GitHub Pages

```bash
git add .
git commit -m "Deploy LazyEmbed"
git push origin main
```

然後在 GitHub 儲存庫設定中啟用 GitHub Pages。

### Netlify

1. 將專案推送到 Git 儲存庫
2. 連接到 Netlify
3. 部署設定：
   - Build command: (留空)
   - Publish directory: `.`

### Vercel

```bash
vercel --prod
```

### Cloudflare Workers

Cloudflare Workers 提供全球邊緣運算部署，速度快且可靠。

**前置需求**：
- 安裝 [Node.js](https://nodejs.org/)
- 安裝 Wrangler CLI: `npm install -g wrangler`
- 擁有 Cloudflare 帳號

**部署步驟**：

1. 登入 Cloudflare：
```bash
wrangler login
```

2. 部署到 Workers：
```bash
wrangler deploy
```

3. 訪問您的網站：
```
https://lazyembed.workers.dev
```

**自訂域名**：

如果您想使用自己的域名，請編輯 `wrangler.toml` 中的 routes 設定：

```toml
[env.production]
routes = [
  { pattern = "your-domain.com/*", zone_name = "your-domain.com" }
]
```

然後重新部署：
```bash
wrangler deploy --env production
```

## 自訂樣式

您可以編輯 `css/style.css` 來自訂介面外觀。主要的 CSS 變數位於檔案頂部：

```css
:root {
    --primary-color: #4f46e5;
    --primary-hover: #4338ca;
    --secondary-color: #6b7280;
    /* ... 更多變數 */
}
```

## 瀏覽器支援

- Chrome/Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- 支援 ES6+ 的現代瀏覽器

## 技術棧

- **HTML5** - 結構
- **CSS3** - 樣式與動畫
- **Vanilla JavaScript** - 功能邏輯
- **localStorage** - 資料儲存

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 授權

MIT License

## 作者

LazyEmbed Team

---

**享受輕鬆建立和管理小工具的樂趣！** 🚀
