# AI Content Studio

AI 驅動的內容創作 SaaS，讓使用者登入後輸入主題，自動生成部落格、電子郵件、社群媒體貼文。

## 技術棧

| 類別 | 技術 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 語言 | TypeScript |
| 樣式 | Tailwind CSS + shadcn/ui (Radix UI) |
| 認證 | NextAuth v4（Google OAuth + JWT session） |
| 資料庫 | PostgreSQL（Supabase 雲端托管） |
| ORM | Prisma |
| AI | Anthropic Claude API（claude-haiku-4-5，串流輸出） |

## 專案結構

```
app/
  (dashboard)/
    generate/      # 主要生成頁面
    history/       # 歷史紀錄
    layout.tsx     # Dashboard layout，需登入
  api/
    auth/[...nextauth]/  # NextAuth handler
    generate/            # AI 生成 API（SSE 串流）
  login/           # 登入頁
  layout.tsx       # Root layout，包 SessionProvider
  providers.tsx    # Client-side providers

components/
  generate-form.tsx   # 主表單：類型選擇、主題輸入、語調、語言
  stream-output.tsx   # 串流輸出顯示
  content-type-tabs.tsx
  sidebar.tsx
  ui/              # shadcn/ui 元件

lib/
  auth.ts          # NextAuth authOptions（Google Provider + PrismaAdapter）
  prisma.ts        # Prisma client singleton
  prompts.ts       # 根據類型/語調/語言建構 prompt
  utils.ts         # cn() helper
```

## 資料庫 Schema

- **User** / **Account** / **Session** / **VerificationToken**：NextAuth 標準表
- **Content**：使用者生成的內容，欄位包含 type（BLOG/EMAIL/SOCIAL）、topic、tone、language、output

## AI 生成流程

1. 前端 `POST /api/generate`（帶 type、topic、tone、language）
2. 後端用 `lib/prompts.ts` 的 `buildPrompt()` 組出繁中/簡中/英文 prompt
3. 呼叫 Claude API（`messages.stream()`），SSE 串流回前端
4. 生成完畢後將結果寫入 `Content` 資料表

## 環境變數

```
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ANTHROPIC_API_KEY=
DATABASE_URL=postgresql://...
```

## 常用指令

```bash
npm run dev          # 啟動開發伺服器
npm run db:push      # 同步 schema 到資料庫
npm run db:studio    # 開啟 Prisma Studio
npm run db:generate  # 重新產生 Prisma client
```

## 已知問題 / 注意事項

- `.env.local` 的 `DATABASE_URL` 不可有多餘空格或重複前綴，否則 Prisma 無法啟動
- Google OAuth callback URL 需在 Google Cloud Console 加入 `http://localhost:3000/api/auth/callback/google`
- `openai` 套件仍在 `package.json` 但已不使用，可移除
