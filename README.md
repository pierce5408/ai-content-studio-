# AI Content Studio

AI 驅動的內容創作 SaaS，使用者登入後輸入主題，自動生成部落格文章、電子郵件、社群媒體貼文。

## 功能

- Google OAuth 登入
- 三種內容類型：部落格 / Email / 社群媒體
- 語調風格選擇：專業正式 / 輕鬆親切 / 有說服力 / 資訊豐富
- 輸出語言：繁體中文 / 簡體中文 / English
- AI 串流生成（逐字顯示）
- 複製 / 下載生成內容
- 歷史紀錄查看與刪除

## 技術棧

| 類別 | 技術 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 語言 | TypeScript |
| 樣式 | Tailwind CSS + shadcn/ui |
| 認證 | NextAuth v4（Google OAuth + JWT） |
| 資料庫 | PostgreSQL（Supabase） |
| ORM | Prisma |
| AI | Google Gemini 2.5 Flash（SSE 串流） |
| 部署 | Vercel |

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 並填入對應的值：

```bash
cp .env.example .env.local
```

```env
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://...
```

### 3. 初始化資料庫

```bash
npm run db:push
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

## 專案結構

```
app/
  (dashboard)/
    generate/        # 主要生成頁面
    history/         # 歷史紀錄
  api/
    generate/        # AI 生成 API（SSE 串流）
    content/[id]/    # 刪除內容 API
  login/             # 登入頁

components/
  generate-form.tsx  # 主表單
  stream-output.tsx  # 串流輸出顯示
  history-list.tsx   # 歷史紀錄列表

lib/
  auth.ts            # NextAuth 設定
  prisma.ts          # Prisma client
  prompts.ts         # Prompt 建構邏輯
```

## 常用指令

```bash
npm run dev          # 啟動開發伺服器
npm run build        # 建置
npm run db:push      # 同步 schema 到資料庫
npm run db:studio    # 開啟 Prisma Studio
```

## 部署

本專案部署於 Vercel，推送到 GitHub main branch 後自動重新部署。

詳細部署流程請參考 `docs/vercel-deploy.md`。
