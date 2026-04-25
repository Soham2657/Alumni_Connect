import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type AiMessageRole = "user" | "assistant";

export interface AiMentorMatch {
  id: string;
  name: string;
  role: string;
  currentCompany: string;
  location: string;
  skills: string[];
}

export interface AiChatMessage {
  id: string;
  role: AiMessageRole;
  content: string;
  createdAt: string;
  matchedSkills?: string[];
  mentors?: AiMentorMatch[];
}

interface AiAssistantContextValue {
  isOpen: boolean;
  messages: AiChatMessage[];
  toggleOpen: () => void;
  open: () => void;
  close: () => void;
  addMessage: (message: AiChatMessage) => void;
  setMessages: (messages: AiChatMessage[]) => void;
  clearMessages: () => void;
}

const AiAssistantContext = createContext<AiAssistantContextValue | undefined>(undefined);

export const useAiAssistant = () => {
  const context = useContext(AiAssistantContext);
  if (!context) {
    throw new Error("useAiAssistant must be used within AiAssistantProvider");
  }
  return context;
};

export const AiAssistantProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([]);

  const value = useMemo<AiAssistantContextValue>(() => {
    return {
      isOpen,
      messages,
      toggleOpen: () => setIsOpen((prev) => !prev),
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      addMessage: (message) => setMessages((prev) => [...prev, message]),
      setMessages,
      clearMessages: () => setMessages([]),
    };
  }, [isOpen, messages]);

  return <AiAssistantContext.Provider value={value}>{children}</AiAssistantContext.Provider>;
};
