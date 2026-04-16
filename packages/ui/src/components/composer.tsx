"use client";
import { Paperclip, SendHorizontal } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

export function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="border-t border-border p-4">
      <div className="flex items-end gap-2 rounded-xl border border-border bg-bg-card p-2">
        <button className="p-2 text-fg-muted hover:text-fg" aria-label="Attach">
          <Paperclip size={16} />
        </button>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          placeholder="Message Sales Copilot…"
          rows={1}
          className="flex-1 resize-none bg-transparent px-1 py-2 text-sm focus:outline-none"
        />
        <button
          onClick={submit}
          className="rounded-lg bg-accent-gradient p-2 text-white"
          aria-label="Send"
        >
          <SendHorizontal size={16} />
        </button>
      </div>
      <div className="mt-2 flex gap-2 text-xs text-fg-muted">
        <span className="rounded-md border border-border px-2 py-0.5">⎔ summarize</span>
        <span className="rounded-md border border-border px-2 py-0.5">⎔ action items</span>
        <span className="rounded-md border border-border px-2 py-0.5">⎔ translate</span>
      </div>
    </div>
  );
}
