# 歷史紀錄功能說明

## 概覽

歷史紀錄功能讓已登入的使用者可以查看過去所有 AI 生成的內容，包含類型、主題、語調、語言與輸出內容。

---

## 檔案結構

```
app/(dashboard)/history/page.tsx   # Server Component，直接查詢資料庫
components/history-list.tsx        # Client Component，負責展開/收合與複製
```

---

## 運作流程

### 1. 路由進入點：`app/(dashboard)/history/page.tsx`

這是一個 **Server Component**，在伺服器端直接查詢 PostgreSQL：

```ts
const session = await getServerSession(authOptions);
const contents = await prisma.content.findMany({
  where: { userId: session.user.id },
  orderBy: { createdAt: "desc" },
});
```

- 透過 `getServerSession` 取得當前使用者 session
- 用 Prisma 查詢該使用者所有 Content 紀錄，最新的排最前面
- 資料直接以 props 傳給 `<HistoryList>` Client Component

### 2. 顯示元件：`components/history-list.tsx`

這是一個 **Client Component**（帶 `"use client"`），負責互動邏輯：

- **展開/收合**：每筆紀錄預設只顯示前幾行，點擊可展開完整內容
- **複製功能**：點擊複製按鈕將輸出內容寫入剪貼簿，並短暫顯示「已複製」提示
- **類型 Badge**：BLOG / EMAIL / SOCIAL 以不同顏色標示

---

## 資料庫 Schema

```prisma
model Content {
  id        String   @id @default(cuid())
  userId    String
  type      String   // "BLOG" | "EMAIL" | "SOCIAL"
  topic     String
  tone      String
  language  String
  output    String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## Server vs Client Component 分工

| 層級 | 元件 | 職責 |
|------|------|------|
| Server | `history/page.tsx` | 認證檢查、資料庫查詢 |
| Client | `history-list.tsx` | 展開收合、複製、UI 互動 |

這樣的分工讓資料庫邏輯留在伺服器端（安全、不洩漏憑證），互動邏輯在客戶端（可使用 React state）。

---

## 權限保護

歷史頁面位於 `app/(dashboard)/` 路由群組，其 `layout.tsx` 會統一檢查 session：

```ts
const session = await getServerSession(authOptions);
if (!session) redirect("/login");
```

未登入的使用者會被自動導向 `/login`，無法存取歷史紀錄。
