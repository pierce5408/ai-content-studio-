import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const content = await prisma.content.findUnique({ where: { id: params.id } });
  if (!content || content.userId !== session.user.id) {
    return new Response("Not found", { status: 404 });
  }

  await prisma.content.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
