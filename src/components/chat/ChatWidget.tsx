import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, RotateCcw, Square, AlertCircle, Bot } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../i18n/translations';
import { sendMessageStream } from '../../lib/chat-service';
import { ChatBubble } from './ChatBubble';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

function getFormattedTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export const ChatWidget: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].chat;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastUserPromptRef = useRef<string>('');

  // Initialize or reset welcome message on mount or language switch if conversation is fresh
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 0) {
        return [
          {
            id: 'welcome',
            role: 'assistant',
            content: t.welcome_message,
            timestamp: getFormattedTime(),
          },
        ];
      }
      return prev;
    });
  }, [t.welcome_message]);

  // Auto-scroll to bottom smoothly on message change or streaming chunks
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end',
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(false);
      // Autofocus input when opening
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, errorMessage, scrollToBottom]);

  // Handle ESC key to close widget
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleStopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const lastIndex = prev.length - 1;
      const last = prev[lastIndex];
      if (last.role === 'assistant' && last.isStreaming) {
        const updated = [...prev];
        updated[lastIndex] = { ...last, isStreaming: false };
        return updated;
      }
      return prev;
    });
  };

  const handleResetConversation = () => {
    if (isStreaming) {
      handleStopStream();
    }
    setErrorMessage(null);
    setInputValue('');
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: t.welcome_message,
        timestamp: getFormattedTime(),
      },
    ]);
  };

  const executeSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isStreaming || trimmed.length > 500) {
      return;
    }

    lastUserPromptRef.current = trimmed;
    setErrorMessage(null);
    setInputValue('');

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: getFormattedTime(),
    };

    const assistantMessageId = `asst-${Date.now()}`;
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: getFormattedTime(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, initialAssistantMessage]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await sendMessageStream(
        trimmed,
        (chunk) => {
          setMessages((prev) => {
            const index = prev.findIndex((m) => m.id === assistantMessageId);
            if (index === -1) return prev;
            const updated = [...prev];
            const current = updated[index];
            updated[index] = {
              ...current,
              content: current.content + chunk,
            };
            return updated;
          });
        },
        controller.signal
      );

      // Finished stream cleanly
      setMessages((prev) => {
        const index = prev.findIndex((m) => m.id === assistantMessageId);
        if (index === -1) return prev;
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          isStreaming: false,
        };
        return updated;
      });
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // User deliberately aborted stream
        return;
      }

      const errorText =
        err instanceof Error
          ? err.message
          : 'Ocorreu um erro ao processar a resposta.';

      setErrorMessage(errorText);

      // If the assistant message produced no content, remove the empty bubble
      setMessages((prev) => {
        const index = prev.findIndex((m) => m.id === assistantMessageId);
        if (index === -1) return prev;
        if (!prev[index].content) {
          return prev.filter((m) => m.id !== assistantMessageId);
        }
        const updated = [...prev];
        updated[index] = { ...updated[index], isStreaming: false };
        return updated;
      });
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      executeSend(inputValue);
    }
  };

  const isOnlyWelcome = messages.length === 1 && messages[0].role === 'assistant';

  return (
    <>
      {/* ── Botão Flutuante (Launcher) ─────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={isOpen ? t.button_aria_close : t.button_aria_open}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#0a0a0a] text-white border border-neutral-700 hover:border-neutral-500 shadow-xl shadow-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-transform duration-150 active:scale-95 group"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>

        {isOpen ? (
          <X className="w-4 h-4 text-neutral-300 group-hover:text-white transition-colors duration-150" />
        ) : (
          <MessageSquare className="w-4 h-4 text-neutral-300 group-hover:text-white transition-colors duration-150" />
        )}

        <span className="text-xs font-semibold tracking-wide font-mono text-neutral-200 group-hover:text-white transition-colors duration-150">
          {isOpen ? (language === 'pt' ? 'Fechar' : 'Close') : 'IA'}
        </span>
      </button>

      {/* ── Janela do Chat (Drawer / Modal Flutuante) ────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={t.widget_title}
          className="fixed bottom-16 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-20 z-50 sm:w-[410px] h-[520px] max-h-[calc(100vh-6.5rem)] flex flex-col bg-[#0a0a0a] border border-neutral-800 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden [overflow-x:clip] animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {/* Cabeçalho */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0e0e11] border-b border-neutral-800 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-neutral-200" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate">
                    {t.widget_title}
                  </h3>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
                    title={t.status_online}
                  />
                </div>
                <p className="text-[11px] text-neutral-400 font-mono truncate">
                  {isStreaming ? t.status_streaming : t.widget_subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleResetConversation}
                aria-label={t.clear_aria}
                title={t.clear_aria}
                className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white transition-colors duration-150"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={t.button_aria_close}
                title={t.button_aria_close}
                className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white transition-colors duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Área de Mensagens com scroll automático suave */}
          <div
            className="flex-1 overflow-y-auto [overflow-x:clip] p-4 space-y-3.5 text-neutral-200"
            aria-live="polite"
          >
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                role={message.role}
                content={message.content}
                isStreaming={message.isStreaming}
                timestamp={message.timestamp}
              />
            ))}

            {/* Chips de Perguntas Rápidas (Estado Inicial) */}
            {isOnlyWelcome && !isStreaming && (
              <div className="pt-2 space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 px-1">
                  {language === 'pt' ? 'Sugestões rápidas' : 'Quick questions'}
                </p>
                <div className="flex flex-col gap-1.5">
                  {t.quick_questions.map((question, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => executeSend(question)}
                      className="text-left text-xs text-neutral-300 hover:text-white bg-[#121215] hover:bg-neutral-800/90 border border-neutral-800 hover:border-neutral-700 px-3 py-2 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tratamento de Erro Elegante (Rate limit 429 ou indisponibilidade) */}
            {errorMessage && (
              <div className="bg-red-950/20 border border-red-900/40 text-red-200 text-xs p-3 rounded-lg flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <p className="leading-relaxed">{errorMessage}</p>
                  {lastUserPromptRef.current && !isStreaming && (
                    <button
                      type="button"
                      onClick={() => executeSend(lastUserPromptRef.current)}
                      className="inline-flex items-center text-[11px] font-mono font-medium text-red-300 hover:text-white underline decoration-red-600 hover:decoration-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 rounded transition-colors duration-150"
                    >
                      {t.retry}
                    </button>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Área de Entrada (Input Bar) */}
          <div className="p-3 bg-[#0e0e11] border-t border-neutral-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeSend(inputValue);
              }}
              className="space-y-2"
            >
              <div className="relative flex items-center bg-[#121215] border border-neutral-800 focus-within:border-neutral-600 rounded-xl px-3 py-2 transition-colors duration-150">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.slice(0, 500))}
                  onKeyDown={handleKeyDown}
                  placeholder={t.input_placeholder}
                  disabled={isStreaming}
                  className="w-full bg-transparent text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-500 resize-none outline-none focus:outline-none focus-visible:outline-none max-h-24 disabled:opacity-50"
                />

                <div className="flex items-center gap-1.5 pl-2 shrink-0">
                  {isStreaming ? (
                    <button
                      type="button"
                      onClick={handleStopStream}
                      aria-label={t.stop_aria}
                      title={t.stop_aria}
                      className="p-1.5 rounded-lg bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white transition-colors duration-150"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || inputValue.length > 500}
                      aria-label={t.send_aria}
                      title={t.send_aria}
                      className="p-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 transition-colors duration-150"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Rodapé com Contador de Caracteres e Disclaimer Factual */}
              <div className="flex items-center justify-between text-[10px] text-neutral-400 px-1 font-mono">
                <span className="truncate pr-2">{t.disclaimer}</span>
                <span
                  className={
                    inputValue.length >= 450
                      ? 'text-amber-400 font-semibold shrink-0'
                      : 'shrink-0'
                  }
                >
                  {inputValue.length}/500
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
