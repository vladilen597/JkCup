"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { MessageSquare, X, Send, Loader2 } from "lucide-react"; // Установи: npm i lucide-react
import { useAppSelector } from "@/app/utils/store/hooks";
import { format } from "date-fns";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function ChatWidget({ initialMessages = [] }: any) {
  const { currentUser } = useAppSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime_chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, image_url")
            .eq("id", payload.new.profile_id)
            .single();

          const newMessage = {
            ...payload.new,
            profile: profile || { full_name: "Пользователь", image_url: null },
          };

          setMessages((prev) => [...prev, newMessage]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, currentUser?.id]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!input.trim()) return;

    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });

      if (response.ok) {
        setInput("");
      } else {
        const err = await response.json();
        alert(err.error);
      }
    } catch (err) {
      console.error("Failed to send:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-24 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-125 bg-background rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-background text-white flex justify-between items-center">
            <h3 className="font-bold">Общий чат (24ч)</h3>
            <button className="cursor-pointer" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-1 bg-background"
          >
            {messages?.length ? (
              messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.profile_id === currentUser?.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-xl text-sm ${
                      msg.profile_id === currentUser?.id
                        ? "bg-primary/15 text-white rounded-br-none"
                        : "bg-card border rounded-bl-none text-white"
                    }`}
                  >
                    <div className="text-[10px] opacity-70 mb-1">
                      {msg.profile?.full_name || "User"}
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-neutral-400">
                Пока сообщений нет, начните переписываться
              </p>
            )}
          </div>

          {currentUser?.id && (
            <form
              onSubmit={sendMessage}
              className="p-3 border-t bg-background flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Напишите сообщение..."
                className="flex-1 text-sm bg-background border-none rounded-full px-4 focus:ring-2 focus:ring-primary outline-none"
              />
              <button
                type="submit"
                className="p-2 bg-background text-white rounded-full hover:bg-primary transition cursor-pointer"
                disabled={isLoading || !input.length}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-3 h-3" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
              </button>
            </form>
          )}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all cursor-pointer"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
}
