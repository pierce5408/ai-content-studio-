import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildPrompt, ContentType } from "@/lib/prompts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: "你是一位專業的內容創作者，擅長撰寫高品質的部落格、電子郵件和社群媒體內容。",
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { type, topic, tone, language } = (await req.json()) as {
    type: ContentType;
    topic: string;
    tone: string;
    language: string;
  };

  if (!type || !topic?.trim()) {
    return new Response("Missing required fields", { status: 400 });
  }

  const prompt = buildPrompt(type, topic.trim(), tone || "professional", language || "zh-TW");
  const encoder = new TextEncoder();
  let fullContent = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(prompt);

        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            fullContent += text;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
        );
        controller.close();

        await prisma.content.create({
          data: {
            userId: session.user!.id as string,
            type,
            topic: topic.trim(),
            tone: tone || "professional",
            language: language || "zh-TW",
            output: fullContent,
          },
        });
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Generation failed";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
