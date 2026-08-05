import React, { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function GlowingInput({
  placeholder = "Make a country song about ....",
  onSubmit,
}: {
  placeholder?: string;
  onSubmit?: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef<number | null>(null);

  const canSubmit = value.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit?.(value.trim());
    if (!onSubmit) console.log("Submitted:", value.trim());
    setValue(""); // 제출 후 초기화
    setIsTyping(false);
  };

  // cleanup any pending timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimer.current) window.clearTimeout(typingTimer.current);
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center py-10">
      <div className="relative w-full max-w-[760px] flex justify-center">
        {/* LEFT light trail */}
        <motion.div
          aria-hidden
          className="absolute -left-80 top-1/2 -translate-y-1/2 w-80 h-16 blur-2xl pointer-events-none hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(59,130,246,0.45), rgba(59,130,246,0.12), rgba(0,0,0,0))",
          }}
          animate={{ opacity: isFocused ? 0.85 : 0.40 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />

        {/* RIGHT light trail */}
        <motion.div
          aria-hidden
          className="absolute -right-80 top-1/2 -translate-y-1/2 w-80 h-16 blur-2xl pointer-events-none hidden md:block"
          style={{
            background:
              "linear-gradient(270deg, rgba(59,130,246,0.45), rgba(59,130,246,0.12), rgba(0,0,0,0))",
          }}
          animate={{ opacity: isFocused ? 0.85 : 0.40 }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.05 }}
        />

        {/* PILL / PROMPT BAR */}
        <motion.div
          className="group relative flex items-center w-full px-5 py-3 md:px-6 md:py-4 rounded-full bg-white ring-1 ring-slate-400 shadow-[0_0_80px_-25px_rgba(59,130,246,0.25)] transition-shadow"
          initial={{ boxShadow: "0 0 60px -30px rgba(59,130,246,0.20)" }}
          animate={{
            boxShadow: isFocused
              ? "0 0 120px -25px rgba(59,130,246,0.45)"
              : "0 0 80px -30px rgba(59,130,246,0.25)",
          }}
          whileHover={{ scale: 1.01 }}
        >
          {/* inner edge + top highlight */}
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-slate-100" />
          <div aria-hidden className="pointer-events-none absolute left-4 right-4 top-1 h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent opacity-80" />

          {/* left icon chip */}
          <motion.div
            className="mr-3 grid h-10 w-10 place-items-center rounded-full bg-blue-50 ring-1 ring-blue-200 shrink-0"
            animate={{
              scale: isFocused ? 1.05 : 1,
              filter: isFocused ? "drop-shadow(0 0 10px rgba(59,130,246,0.6))" : "none",
            }}
          >
            <Sparkles className="h-5 w-5 text-blue-500" />
          </motion.div>

          {/* Accessible label for screen readers */}
          <label htmlFor="ai-prompt" className="sr-only">
            Prompt
          </label>

          {/* INPUT (you can type here) */}
          <input
            id="ai-prompt"
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setIsTyping(true);
              if (typingTimer.current) window.clearTimeout(typingTimer.current);
              typingTimer.current = window.setTimeout(() => setIsTyping(false), 700);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder={placeholder}
            className="flex-1 min-w-0 bg-transparent placeholder-slate-400 text-slate-900 outline-none text-base md:text-xl caret-blue-500"
            autoComplete="off"
            spellCheck={false}
          />

          {/* action button */}
          <motion.button
            type="button"
            aria-label="Generate"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="relative cursor-pointer grid h-10 w-10 md:h-12 md:w-12 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg ring-4 ring-blue-400/20 focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed shrink-0 ml-2"
            whileHover={{ scale: canSubmit ? 1.06 : 1 }}
            whileTap={{ scale: canSubmit ? 0.96 : 1 }}
            animate={{
              boxShadow: canSubmit
                ? "0 0 40px rgba(59,130,246,0.45)"
                : "0 0 12px rgba(59,130,246,0.15)",
            }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
          >
            {/* The ArrowRight "runs" to the right while typing */}
            <motion.span
              className="grid"
              animate={
                isTyping
                  ? { x: [0, 6, 12] }
                  : { x: 0 }
              }
              transition={
                isTyping
                  ? { duration: 0.8, repeat: Infinity, ease: "easeIn" }
                  : { duration: 0.2 }
              }
            >
              <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
            </motion.span>
            {/* bright rim */}
            <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/30" />
          </motion.button>

          {/* end hot-spots (bright cores) */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 h-8 w-8 md:h-12 md:w-12 rounded-full bg-blue-400/50 blur-xl hidden md:block"
            animate={{ opacity: isFocused ? 1 : 0.7 }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 h-8 w-8 md:h-12 md:w-12 rounded-full bg-blue-400/50 blur-xl hidden md:block"
            animate={{ opacity: isFocused ? 1 : 0.7 }}
          />
        </motion.div>
      </div>
    </div>
  );
}
