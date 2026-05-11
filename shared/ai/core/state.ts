import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";
import { RequestContext } from "../../types/core";

export const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  context: Annotation<RequestContext | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  complexity: Annotation<"simple" | "moderate" | "complex">({
    reducer: (x, y) => y ?? x,
    default: () => "moderate",
  }),
  // ✅ Personalization fields
  schoolName: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "Your School",
  }),
  userName: Annotation<string | undefined>({
    reducer: (x, y) => y ?? x,
    default: () => undefined,
  }),
  userRole: Annotation<string | undefined>({
    reducer: (x, y) => y ?? x,
    default: () => undefined,
  })
});
