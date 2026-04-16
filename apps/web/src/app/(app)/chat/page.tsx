"use client";
import { useState } from "react";
import { ChatBubble, Composer } from "@ai-node/ui";

type Msg = { role: "user" | "assistant"; content: string };

const seed: Msg[] = [
  { role: "user", content: "Resume the last Q3 analysis." },
  {
    role: "assistant",
    content:
      "Sure — here are the highlights:\n\n- Revenue **+18%** QoQ\n- Churn dropped to **2.4%**\n- Pipeline coverage 3.6×",
  },
];

const conversations = [
  { group: "Today", items: ["Q3 recap", "Lead review"] },
  { group: "Yesterday", items: ["Deal notes"] },
  { group: "Older", items: ["Onboarding plan"] },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(seed);

  function send(text: string) {
    setMessages((m) => [...m, { role: "user", content: text }]);
    // TODO: connect to /chat SSE
  }

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-[260px_1fr] gap-4">
      <aside className="glass rounded-2xl p-3 text-sm">
        <button className="mb-3 w-full rounded-lg bg-accent-gradient px-3 py-2 text-white">
          + New chat
        </button>
        {conversations.map((g) => (
          <div key={g.group} className="mb-4">
            <div className="px-2 text-xs uppercase tracking-wide text-fg-muted">
              {g.group}
            </div>
            <ul className="mt-1 space-y-1">
              {g.items.map((it) => (
                <li
                  key={it}
                  className="cursor-pointer rounded-md px-2 py-1.5 text-fg-muted hover:bg-bg-card hover:text-fg"
                >
                  ▸ {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <section className="flex flex-col overflow-hidden rounded-2xl glass">
        <header className="flex items-center justify-between border-b border-border px-5 py-3 text-sm">
          <div>
            <span className="font-medium">Sales Copilot</span>{" "}
            <span className="text-fg-muted">· claude-sonnet-4-6 · temp 0.4</span>
          </div>
          <button className="rounded-md border border-border px-2 py-1 text-xs">⚙</button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role}>
              {m.content}
            </ChatBubble>
          ))}
        </div>

        <Composer onSend={send} />
      </section>
    </div>
  );
}
