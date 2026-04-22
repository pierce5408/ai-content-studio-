"use client";
import { useState, useEffect } from "react";
import { ContentTypeTabs, ContentType } from "@/components/content-type-tabs";
import { StreamOutput } from "@/components/stream-output";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function GenerateForm() {
  const [type, setType] = useState<ContentType>("BLOG");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState("zh-TW");
  const [output, setOutput] = useState(() => sessionStorage.getItem("generate-output") ?? "");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    sessionStorage.setItem("generate-output", output);
  }, [output]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("請輸入主題");
      return;
    }
    setError("");
    setOutput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, topic, tone, language }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          let data: { text?: string; done?: boolean; error?: string };
          try {
            data = JSON.parse(line.slice(6));
          } catch {
            continue; // skip malformed JSON lines
          }
          if (data.error) throw new Error(data.error);
          if (data.text) setOutput((prev) => prev + data.text);
          if (data.done) break;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失敗，請重試");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleReset = () => {
    setOutput("");
    setError("");
    setTopic("");
    sessionStorage.removeItem("generate-output");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-5">
          {/* Content Type */}
          <div className="space-y-2">
            <Label>內容類型</Label>
            <ContentTypeTabs value={type} onChange={setType} />
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <Label htmlFor="topic">主題 / 描述</Label>
            <Textarea
              id="topic"
              placeholder={
                type === "BLOG"
                  ? "例如：如何用 AI 提升工作效率"
                  : type === "EMAIL"
                  ? "例如：邀請客戶參加新產品發布會"
                  : "例如：分享我們最新推出的夏季優惠活動"
              }
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={isStreaming}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          {/* Options Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>語調風格</Label>
              <Select value={tone} onValueChange={setTone} disabled={isStreaming}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">專業正式</SelectItem>
                  <SelectItem value="casual">輕鬆親切</SelectItem>
                  <SelectItem value="persuasive">有說服力</SelectItem>
                  <SelectItem value="informative">資訊豐富</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>輸出語言</Label>
              <Select value={language} onValueChange={setLanguage} disabled={isStreaming}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh-TW">繁體中文</SelectItem>
                  <SelectItem value="zh-CN">簡體中文</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            className="w-full gap-2"
            size="lg"
            onClick={handleGenerate}
            disabled={isStreaming || !topic.trim()}
          >
            <Sparkles className="w-4 h-4" />
            {isStreaming ? "生成中..." : "AI 生成內容"}
          </Button>
        </CardContent>
      </Card>

      <StreamOutput content={output} isStreaming={isStreaming} onReset={handleReset} />
    </div>
  );
}
