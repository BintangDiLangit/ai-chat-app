// app/api/chat/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const response = await fetch(
      `${process.env.OLLAMA_ENDPOINT}/api/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.OLLAMA_API_KEY!,
        },
        body: JSON.stringify({
          model: "deepseek-r1:1.5b",
          prompt,
          stream: true,
        }),
      }
    );

    if (!response.ok) throw new Error("Ollama API error");

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          controller.enqueue(decoder.decode(value));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
