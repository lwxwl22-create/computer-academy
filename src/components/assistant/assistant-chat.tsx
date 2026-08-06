"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Eraser, Send, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { assistant } from "@/lib/ai/assistant";
import { useAssistantStore } from "@/lib/stores/assistant-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function AssistantChat() {
  const { open, setOpen, messages, pushMessage, clear } = useAssistantStore();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  async function send(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing) return;
    pushMessage("user", text);
    setInput("");
    setTyping(true);
    const reply = await assistant.reply(text);
    pushMessage("assistant", reply);
    setTyping(false);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="fixed bottom-20 right-4 z-50 flex h-[520px] max-h-[calc(100vh-120px)] w-[calc(100vw-32px)] max-w-sm flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary/15 to-transparent px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">AI 助教</p>
                  <p className="text-[11px] text-muted-foreground">离线知识引擎 · 随时可问</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="iconSm" variant="ghost" onClick={clear} title="清空记录">
                  <Eraser className="h-4 w-4" />
                </Button>
                <Button size="iconSm" variant="ghost" onClick={() => setOpen(false)} title="关闭">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm border bg-muted/50",
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm border bg-muted/50 px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={send} className="border-t p-3">
              <div className="flex items-end gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="问：CPU 为什么快？"
                  className="min-h-[44px] max-h-32 resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(e as unknown as FormEvent);
                    }
                  }}
                />
                <Button type="submit" size="icon" disabled={!input.trim() || typing} aria-label="发送">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-indigo-600 text-primary-foreground shadow-xl"
        aria-label="打开 AI 助手"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </motion.button>
    </>
  );
}
