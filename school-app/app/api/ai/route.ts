import { NextResponse } from "next/server";
import { authenticateRequest } from "@edu/shared/auth/middleware";
import { createAgentGraph } from "@edu/shared/ai/core/graph";
import { HumanMessage, AIMessageChunk } from "@langchain/core/messages";
import { 
  checkChatbotAccess, 
  validateChatbotRequest, 
  addSchoolIsolation,
  logChatbotAccess 
} from "@edu/shared/ai/middleware/security";

export async function POST(request: Request) {
  try {
    const session = {
      headers: { authorization: request.headers.get("authorization") ?? undefined }
    };

    const ctx = authenticateRequest(session as any, "school");

    if (!ctx) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ SECURITY CHECK 1: Check if user can access chatbot (Admin only)
    const accessCheck = checkChatbotAccess(ctx);
    if (!accessCheck.canAccessChatbot) {
      logChatbotAccess(ctx, "", "error");
      return NextResponse.json(
        { 
          error: "Access Denied", 
          message: accessCheck.reason || "Chatbot is only available for school administrators"
        }, 
        { status: 403 }
      );
    }

    const body = await request.json();
    const { message, thread_id } = body;

    // ✅ SECURITY CHECK 2: Validate and sanitize message
    const validation = validateChatbotRequest(ctx, message);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const sanitizedMessage = validation.sanitizedMessage!;

    // ✅ SECURITY CHECK 3: Add school isolation to context
    const secureCtx = addSchoolIsolation(ctx);

    // Log access for audit trail
    logChatbotAccess(secureCtx, sanitizedMessage, "request");

    const graph = createAgentGraph();

    let complexity: "simple" | "moderate" | "complex" = "moderate";
    if (sanitizedMessage.length < 100 && !sanitizedMessage.toLowerCase().includes("analyze")) {
      complexity = "simple";
    } else if (sanitizedMessage.length > 500 || sanitizedMessage.toLowerCase().includes("deep analysis")) {
      complexity = "complex";
    }

    const config = {
      configurable: {
        thread_id: thread_id || `thread_${Date.now()}`,
        context: secureCtx // ✅ Pass secure context with school isolation
      }
    };

    // Use streamEvents for streaming capability
    const stream = await graph.streamEvents(
      {
        messages: [new HumanMessage({ content: sanitizedMessage })],
        context: secureCtx,
        complexity: complexity,
        // ✅ Add school info for personalization
        schoolName: secureCtx.school_name || "Your School",
        userName: secureCtx.user?.name || secureCtx.actor_email || "Admin",
        userRole: secureCtx.user?.role || secureCtx.role
      },
      { ...config, version: "v2" }
    );

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode(`{"thread_id": "${config.configurable.thread_id}", "type": "meta"}\n`));
        try {
          for await (const event of stream) {
            if (event.event === "on_chat_model_stream") {
              const chunk = event.data.chunk as AIMessageChunk;
              if (chunk.content) {
                const text = typeof chunk.content === "string" ? chunk.content : JSON.stringify(chunk.content);
                controller.enqueue(encoder.encode(`{"type": "chunk", "content": ${JSON.stringify(text)}}\n`));
              }
            }
          }
          
          // Log successful response
          logChatbotAccess(secureCtx, sanitizedMessage, "response");
        } catch (err: any) {
          controller.enqueue(encoder.encode(`{"type": "error", "content": ${JSON.stringify(err.message)}}\n`));
          logChatbotAccess(secureCtx, sanitizedMessage, "error");
        } finally {
          controller.close();
        }
      }
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });

  } catch (error: any) {
    console.error("AI Assistant Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
