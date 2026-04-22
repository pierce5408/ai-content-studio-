import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HistoryList } from "@/components/history-list";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  const contents = await prisma.content.findMany({
    where: { userId: session!.user!.id as string },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      type: true,
      topic: true,
      tone: true,
      output: true,
      createdAt: true,
    },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">歷史記錄</h1>
        <p className="text-gray-500 mt-1">您過去生成的所有內容</p>
      </div>
      <HistoryList contents={contents} />
    </div>
  );
}
