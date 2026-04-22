"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, FileText, Mail, Share2, ChevronDown, ChevronUp } from "lucide-react";

type ContentItem = {
  id: string;
  type: "BLOG" | "EMAIL" | "SOCIAL";
  topic: string;
  tone: string | null;
  output: string;
  createdAt: Date;
};

const TYPE_CONFIG = {
  BLOG: { label: "部落格", icon: FileText, variant: "default" as const },
  EMAIL: { label: "Email", icon: Mail, variant: "secondary" as const },
  SOCIAL: { label: "社群", icon: Share2, variant: "outline" as const },
};

function HistoryItem({ item }: { item: ContentItem }) {
  const [expanded, setExpanded] = useState(false);
  const config = TYPE_CONFIG[item.type];
  const Icon = config.icon;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(item.output);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Badge variant={config.variant} className="gap-1 shrink-0">
              <Icon className="w-3 h-3" />
              {config.label}
            </Badge>
            <span className="font-medium text-sm truncate">{item.topic}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-gray-400">
              {new Date(item.createdAt).toLocaleDateString("zh-TW", {
                month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-0">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto font-sans">
            {item.output}
          </pre>
        </CardContent>
      )}
    </Card>
  );
}

export function HistoryList({ contents }: { contents: ContentItem[] }) {
  if (contents.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">尚無歷史記錄</p>
        <p className="text-xs mt-1">生成第一篇內容後將會顯示在這裡</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">共 {contents.length} 筆記錄</p>
      {contents.map((item) => (
        <HistoryItem key={item.id} item={item} />
      ))}
    </div>
  );
}
