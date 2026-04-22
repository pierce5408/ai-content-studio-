import { GenerateForm } from "@/components/generate-form";

export default function GeneratePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">生成內容</h1>
        <p className="text-gray-500 mt-1">選擇內容類型，輸入主題，讓 AI 為您創作</p>
      </div>
      <GenerateForm />
    </div>
  );
}
