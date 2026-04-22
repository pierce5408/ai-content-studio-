"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Mail, Share2 } from "lucide-react";

export type ContentType = "BLOG" | "EMAIL" | "SOCIAL";

interface ContentTypeTabsProps {
  value: ContentType;
  onChange: (value: ContentType) => void;
}

const TABS = [
  { value: "BLOG", label: "部落格", icon: FileText, desc: "長篇文章" },
  { value: "EMAIL", label: "Email", icon: Mail, desc: "電子郵件" },
  { value: "SOCIAL", label: "社群文案", icon: Share2, desc: "多平台貼文" },
] as const;

export function ContentTypeTabs({ value, onChange }: ContentTypeTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as ContentType)}>
      <TabsList className="grid grid-cols-3 w-full h-auto p-1 gap-1">
        {TABS.map(({ value: tabValue, label, icon: Icon, desc }) => (
          <TabsTrigger
            key={tabValue}
            value={tabValue}
            className="flex flex-col gap-0.5 py-3 data-[state=active]:shadow-md"
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
            <span className="text-xs opacity-60">{desc}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
