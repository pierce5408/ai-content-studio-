export type ContentType = "BLOG" | "EMAIL" | "SOCIAL";

export function buildPrompt(type: ContentType, topic: string, tone: string, language: string): string {
  const langInstruction = language === "zh-TW"
    ? "請用繁體中文撰寫。"
    : language === "zh-CN"
    ? "请用简体中文撰写。"
    : "Please write in English.";

  const toneMap: Record<string, string> = {
    professional: "專業正式",
    casual: "輕鬆親切",
    persuasive: "有說服力",
    informative: "資訊豐富",
  };
  const toneLabel = toneMap[tone] || tone;

  switch (type) {
    case "BLOG":
      return `${langInstruction}
請撰寫一篇關於「${topic}」的部落格文章。
語調：${toneLabel}
要求：
- 包含引人入勝的標題
- 有清楚的段落結構（前言、主體3-4段、結論）
- 約 600-800 字
- 適當使用標題標記（##）`;

    case "EMAIL":
      return `${langInstruction}
請撰寫一封關於「${topic}」的電子郵件。
語調：${toneLabel}
要求：
- 包含主旨行（Subject:）
- 正式的稱呼與結尾
- 清楚、簡潔的主體內容
- 約 200-350 字`;

    case "SOCIAL":
      return `${langInstruction}
請為「${topic}」撰寫社群媒體貼文組合。
語調：${toneLabel}
要求：
- Twitter/X 版本（280字內）
- LinkedIn 版本（100-150字，較專業）
- Instagram caption（含相關 hashtag 5-8 個）
各版本間用分隔線（---）區分`;

    default:
      return `${langInstruction}\n請撰寫關於「${topic}」的內容，語調：${toneLabel}。`;
  }
}
