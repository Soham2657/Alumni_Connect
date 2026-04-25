import { useMemo, useState } from "react";
import { Bot, Send, Sparkles, X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AiMentorMatch, useAiAssistant } from "@/context/AiAssistantContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const QUICK_PROMPTS = [
  "Find mentors for React and Node",
  "I want a mentor in Product Management",
  "Looking for a data science mentor",
];

const AiAssistantWidget = () => {
  const { user } = useAuth();
  const { isOpen, toggleOpen, close, messages, addMessage, clearMessages } = useAiAssistant();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const greeting = useMemo(() => {
    if (user?.name) {
      return `Hi ${user.name.split(" ")[0]}! Ask me to match mentors based on your skills.`;
    }
    return "Hi! Ask me to match mentors based on your skills.";
  }, [user?.name]);

  const ensureGreeting = () => {
    if (messages.length === 0) {
      addMessage({
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: greeting,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const sendMessage = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (!user) {
      addMessage({
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: "Please login first so I can fetch mentor matches from the backend.",
        createdAt: new Date().toISOString(),
      });
      return;
    }

    addMessage({
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    });

    setIsSending(true);
    void api.ai
      .mentorMatch({ query: trimmed, userId: user?.id })
      .then((response) => {
        const mentors = (response.data || []).map((item: any) => {
          const mentor = item?.mentor ?? item;
          return {
            id: String(mentor?.id ?? mentor?._id ?? `mentor-${Math.random().toString(36).slice(2)}`),
            name: String(mentor?.name ?? "Unknown mentor"),
            role: String(mentor?.role ?? "Alumni"),
            currentCompany: String(mentor?.currentCompany ?? mentor?.company ?? "N/A"),
            location: String(mentor?.location ?? "N/A"),
            skills: Array.isArray(mentor?.skills) ? mentor.skills : [],
          } as AiMentorMatch;
        });

        addMessage({
          id: `ai-${Date.now() + 1}`,
          role: "assistant",
          content: "Here are some alumni mentors who match your request.",
          createdAt: new Date().toISOString(),
          mentors,
        });
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "I couldn't reach the AI service right now. Try again later.";
        addMessage({
          id: `ai-${Date.now() + 1}`,
          role: "assistant",
          content: message,
          createdAt: new Date().toISOString(),
        });
      })
      .finally(() => setIsSending(false));
  };

  const handleSend = () => {
    sendMessage(input);
    setInput("");
  };

  const handlePrompt = (prompt: string) => {
    ensureGreeting();
    sendMessage(prompt);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <Button
          onClick={() => {
            ensureGreeting();
            toggleOpen();
          }}
          className="rounded-full h-14 px-5 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Bot className="w-5 h-5 mr-2" />
          Mentor AI
        </Button>
      )}

      {isOpen && (
        <div className="w-[340px] md:w-[380px] bg-card border border-border shadow-2xl rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Mentor Match AI</p>
                <p className="text-xs text-muted-foreground">Backend AI mentor matching</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={clearMessages}>
                <Minus className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={close}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-80">
            <div className="space-y-4 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>

                    {message.matchedSkills && message.matchedSkills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.matchedSkills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {message.mentors && message.mentors.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.mentors.map((mentor) => (
                          <div
                            key={mentor.id}
                            className="rounded-lg border border-border bg-background/70 px-3 py-2"
                          >
                            <p className="text-sm font-semibold text-foreground">
                              {mentor.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {mentor.role} · {mentor.currentCompany}
                            </p>
                            <p className="text-xs text-muted-foreground">{mentor.location}</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {mentor.skills.slice(0, 4).map((skill) => (
                                <Badge key={`${mentor.id}-${skill}`} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {messages.length === 0 && (
                <div className="text-center text-xs text-muted-foreground">
                  Ask about mentors by skill, role, or industry.
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-border p-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK_PROMPTS.map((prompt) => (
                <Button
                  key={prompt}
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                  disabled={isSending}
                  onClick={() => handlePrompt(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ask for mentor matches..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={isSending}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSend();
                  }
                }}
              />
              <Button onClick={handleSend} size="icon" disabled={isSending}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAssistantWidget;
