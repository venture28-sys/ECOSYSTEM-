"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { Send, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/lib/messages";

type ChatContext = { type: "job"; id: string } | { type: "product"; id: string };

interface ChatThreadProps {
  context: ChatContext;
  currentUserId: string;
  otherUserId: string;
  otherUserName: string;
}

export function ChatThread({ context, currentUserId, otherUserId, otherUserName }: ChatThreadProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const contextColumn = context.type === "job" ? "job_id" : "product_id";

  function isThisThread(m: { sender_id: string; recipient_id: string; job_id: string | null; product_id: string | null }) {
    return (
      m[contextColumn] === context.id &&
      ((m.sender_id === currentUserId && m.recipient_id === otherUserId) ||
        (m.sender_id === otherUserId && m.recipient_id === currentUserId))
    );
  }

  async function markIncomingAsRead(msgs: Message[]) {
    const unreadIds = msgs.filter((m) => m.recipient_id === currentUserId && !m.read_at).map((m) => m.id);
    if (unreadIds.length === 0) return;
    await supabase.from("messages").update({ read_at: new Date().toISOString() }).in("id", unreadIds);
  }

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq(contextColumn, context.id)
        .or(
          `and(sender_id.eq.${currentUserId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true });

      setMessages(data || []);
      if (data) markIncomingAsRead(data);
    }
    load();

    const channel = supabase
      .channel(`${context.type}-${context.id}-chat`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `${contextColumn}=eq.${context.id}` },
        (payload) => {
          const newMessage = payload.new as Message;
          if (!isThisThread(newMessage)) return;
          setMessages((prev) => (prev.some((m) => m.id === newMessage.id) ? prev : [...prev, newMessage]));
          if (newMessage.recipient_id === currentUserId) markIncomingAsRead([newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.type, context.id, currentUserId, otherUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;

    setSending(true);
    setDraft("");

    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticMessage: Message = {
      id: optimisticId,
      job_id: context.type === "job" ? context.id : null,
      product_id: context.type === "product" ? context.id : null,
      sender_id: currentUserId,
      recipient_id: otherUserId,
      body,
      read_at: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    const { error } = await supabase.from("messages").insert({
      job_id: context.type === "job" ? context.id : null,
      product_id: context.type === "product" ? context.id : null,
      sender_id: currentUserId,
      recipient_id: otherUserId,
      body,
    });

    if (error) {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setDraft(body);
    }
    setSending(false);
  }

  return (
    <div className="flex flex-col h-[70vh] border border-neutral-100 dark:border-[var(--border)] rounded overflow-hidden bg-[var(--surface)]">
      <div className="px-4 py-3 border-b border-neutral-100 dark:border-[var(--border)] font-display font-semibold">
        {otherUserName}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-neutral-400 py-8">No messages yet — say hello.</p>
        ) : (
          messages.map((m) => {
            if (m.is_system) {
              return (
                <div key={m.id} className="flex justify-center">
                  <div className="max-w-[85%] rounded-full bg-accent/10 text-accent text-xs px-4 py-2 flex items-center gap-1.5">
                    <ShieldCheck size={12} className="shrink-0" />
                    {m.body}
                  </div>
                </div>
              );
            }

            const isMine = m.sender_id === currentUserId;
            return (
              <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded px-3.5 py-2.5 text-sm ${
                    isMine ? "bg-primary text-white" : "bg-neutral-100 dark:bg-[var(--surface-2)] text-[var(--text)]"
                  }`}
                >
                  {m.body}
                  <div className={`text-[10px] mt-1 ${isMine ? "text-white/70" : "text-neutral-400"}`}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {isMine && m.read_at && " · Read"}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-neutral-100 dark:border-[var(--border)]">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded border border-neutral-200 dark:border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm focus:outline-none focus:border-2 focus:border-primary"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="w-10 h-10 rounded bg-primary text-white flex items-center justify-center disabled:bg-neutral-200 disabled:text-neutral-400 shrink-0"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
