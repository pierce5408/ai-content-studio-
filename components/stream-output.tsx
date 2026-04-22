"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, RefreshCw } from "lucide-react";

interface StreamOutputProps {
  content: string;
  isStreaming: boolean;
  onReset: () => void;
}

export function StreamOutput({ content, isStreaming, onReset }: StreamOutputProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isStreaming) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [content, isStreaming]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!content && !isStreaming) return null;

  return (
    <div className="mt-6 rounded-lg border bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              AI 正在生成中...
            </span>
          )}
          {!isStreaming && content && (
            <span className="text-xs text-gray-500 font-medium">
              生成完成 · {content.length} 字元
            </span>
          )}
        </div>
        {!isStreaming && content && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5 h-8">
              <Copy className="w-3.5 h-3.5" />
              {copied ? "已複製！" : "複製"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload} className="gap-1.5 h-8">
              <Download className="w-3.5 h-3.5" />
              下載
            </Button>
            <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5 h-8">
              <RefreshCw className="w-3.5 h-3.5" />
              重置
            </Button>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="p-6 max-h-[500px] overflow-y-auto">
        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
          {content}
          {isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-primary animate-pulse ml-0.5 align-text-bottom" />
          )}
        </pre>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
