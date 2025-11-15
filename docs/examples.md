# 範例小工具

專案包含三個範例小工具，位於 `widgets/` 資料夾，展示不同類型的小工具實作。

## 1. 時鐘小工具 (`example-clock.html`)

即時顯示時間和日期的美觀時鐘。

**嵌入方式**：
```html
<iframe src="widgets/example-clock.html" width="400" height="300" frameborder="0"></iframe>
```

**功能特點**：
- 即時更新的時間顯示
- 日期資訊
- 美觀的視覺設計

## 2. 計數器小工具 (`example-counter.html`)

互動式計數器，支援增加、減少和重置功能。

**嵌入方式**：
```html
<iframe src="widgets/example-counter.html" width="400" height="400" frameborder="0"></iframe>
```

**功能特點**：
- 增加計數
- 減少計數
- 重置功能
- 互動式按鈕

## 3. 天氣小工具 (`example-weather.html`)

展示天氣資訊的美觀卡片（範例資料）。

**嵌入方式**：
```html
<iframe src="widgets/example-weather.html" width="400" height="500" frameborder="0"></iframe>
```

**功能特點**：
- 溫度顯示
- 天氣狀況
- 美觀的卡片設計

## 如何使用範例小工具

1. **在 LazyEmbed 管理介面中新增**：
   - 點擊「新增小工具」
   - 選擇「iFrame 嵌入」類型
   - 輸入對應的小工具路徑（例如：`widgets/example-clock.html`）
   - 設定適當的尺寸
   - 儲存並預覽

2. **直接嵌入到您的網站**：
   - 複製上方的嵌入代碼
   - 調整 `src` 路徑為您的實際部署路徑
   - 根據需要調整寬度和高度
   - 貼到您的網頁中

## 自訂範例小工具

所有範例小工具都是獨立的 HTML 檔案，您可以：

- 修改樣式和佈局
- 加入新功能
- 整合 API 資料
- 建立您自己的小工具變體

範例小工具的代碼結構簡單清晰，適合作為開發自訂小工具的起點。
