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

  // Balãozinho (tooltip) convidativo inicial
  const [showTooltip, setShowTooltip] = useState(false);
  const hasInteractedRef = useRef(false);

  const handleDismissTooltip = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    hasInteractedRef.current = true;
    setShowTooltip(false);
  }, []);

  // Timer para exibir o balãozinho convidativo após 2.5s se o chat ainda estiver fechado
  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      hasInteractedRef.current = true;
      return;
    }

    if (hasInteractedRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Escuta evento customizado 'open-ai-chat' disparado pelo botão do Hero ou outros pontos
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setShowTooltip(false);
      hasInteractedRef.current = true;
    };
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastUserPromptRef = useRef<string>('');

  // Auto-resize textarea dynamically based on scrollHeight (1 line up to ~120px)
  const adjustTextareaHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const nextHeight = Math.min(el.scrollHeight, 120);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > 120 ? 'auto' : 'hidden';
  }, []);

  const resetTextareaHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.overflowY = 'hidden';
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue, adjustTextareaHeight]);

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
    resetTextareaHeight();
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
    resetTextareaHeight();

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
      {/* ── Balãozinho Convidativo Inicial (Tooltip - Solução 2) ──────── */}
      {!isOpen && (
        <div
          role="status"
          aria-live="polite"
          aria-hidden={!showTooltip}
          className={`fixed bottom-[4.5rem] right-4 sm:bottom-20 sm:right-6 z-50 max-w-[280px] sm:max-w-[320px] p-3 rounded-xl bg-white dark:bg-[#121215] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-black/10 dark:shadow-black/60 transition-all duration-300 ease-out motion-reduce:transition-none cursor-pointer group select-none ${
            showTooltip
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
          onClick={() => {
            if (!showTooltip) return;
            setIsOpen(true);
            handleDismissTooltip();
          }}
        >
          <div className="flex items-start gap-2.5">
            <span className="text-base select-none shrink-0 leading-none pt-0.5" aria-hidden="true">
              👋
            </span>
            <p className="text-xs font-sans text-neutral-600 dark:text-neutral-300 leading-snug flex-1 select-none">
              {language === 'pt' ? (
                <>
                  Dúvidas sobre minhas <span className="font-semibold text-neutral-900 dark:text-white">stacks</span> ou <span className="font-semibold text-neutral-900 dark:text-white">projetos</span>? Pergunte à minha IA!
                </>
              ) : (
                <>
                  Questions about my <span className="font-semibold text-neutral-900 dark:text-white">stacks</span> or <span className="font-semibold text-neutral-900 dark:text-white">projects</span>? Ask my AI!
                </>
              )}
            </p>
            <button
              type="button"
              tabIndex={showTooltip ? 0 : -1}
              onClick={handleDismissTooltip}
              aria-label={t.tooltip_dismiss || (language === 'pt' ? 'Dispensar aviso' : 'Dismiss notice')}
              className="p-1 -mr-1 -mt-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Seta sutil apontando para o launcher flutuante */}
          <div
            aria-hidden="true"
            className="absolute -bottom-1.5 right-6 sm:right-8 w-3 h-3 rotate-45 bg-white dark:bg-[#121215] border-r border-b border-neutral-200 dark:border-neutral-800"
          />
        </div>
      )}

      {/* ── Botão Flutuante (Launcher - Solução 1 Pill) ────────────────── */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => {
            const next = !prev;
            if (next) handleDismissTooltip();
            return next;
          });
        }}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={isOpen ? t.button_aria_close : t.button_aria_open}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 ${
          isOpen ? 'hidden sm:flex' : 'flex'
        } items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-neutral-900 dark:bg-[#0a0a0a] text-white border border-neutral-700 hover:border-neutral-500 shadow-xl shadow-black/30 dark:shadow-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black transition-transform duration-150 active:scale-95 group`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>

        {isOpen ? (
          <X className="w-4 h-4 text-neutral-300 group-hover:text-white transition-colors duration-150" />
        ) : (
          <MessageSquare className="w-4 h-4 text-neutral-300 group-hover:text-white transition-colors duration-150" />
        )}

        <span className="text-xs font-semibold tracking-wide font-mono text-neutral-200 group-hover:text-white transition-colors duration-150">
          {isOpen ? (
            language === 'pt' ? 'Fechar' : 'Close'
          ) : (
            <>
              <span className="sm:hidden">IA</span>
              <span className="hidden sm:inline">
                {t.launcher_text || (language === 'pt' ? 'Pergunte à IA' : 'Ask AI')}
              </span>
            </>
          )}
        </span>
      </button>

      {/* ── Janela do Chat (Bottom Sheet Mobile / Drawer Desktop) ─────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={t.widget_title}
          className="fixed inset-x-0 bottom-0 sm:bottom-20 sm:right-6 sm:left-auto sm:w-[420px] h-[88vh] sm:h-[540px] max-h-[100dvh] z-50 flex flex-col bg-white dark:bg-[#0a0a0a] border-t sm:border border-neutral-200 dark:border-neutral-800 rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/80 overflow-hidden [overflow-x:clip] animate-in fade-in slide-in-from-bottom-2 duration-200 motion-reduce:animate-none"
        >
          {/* Barra sutil de arrastar/handle no topo em telas mobile */}
          <div className="sm:hidden w-full pt-2 pb-0.5 bg-neutral-50 dark:bg-[#0e0e11] shrink-0">
            <div className="w-10 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto my-1.5" />
          </div>

          {/* Cabeçalho */}
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-[#0e0e11] border-b border-neutral-200 dark:border-neutral-800 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-neutral-200/80 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white tracking-tight truncate">
                    {t.widget_title}
                  </h3>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
                    title={t.status_online}
                  />
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono truncate">
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
                className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-800/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white transition-colors duration-150"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={t.button_aria_close}
                title={t.button_aria_close}
                className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-neutral-800/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white transition-colors duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Área de Mensagens com scroll automático suave */}
          <div
            className="flex-1 overflow-y-auto [overflow-x:clip] p-4 space-y-3.5 text-neutral-800 dark:text-neutral-200"
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
              <div className="pt-2 space-y-2 [overflow-x:clip]">
                <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 px-1">
                  {language === 'pt' ? 'Sugestões rápidas' : 'Quick questions'}
                </p>
                <div className="flex flex-col gap-1.5">
                  {t.quick_questions.map((question, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => executeSend(question)}
                      className="text-left text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 hover:border-neutral-300 dark:bg-[#121215] dark:hover:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 px-3 py-2 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-400"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tratamento de Erro Elegante (Rate limit 429 ou indisponibilidade) */}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-700 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-200 text-xs p-3 rounded-lg flex items-start gap-2.5 [overflow-x:clip]">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <p className="leading-relaxed break-words">{errorMessage}</p>
                  {lastUserPromptRef.current && !isStreaming && (
                    <button
                      type="button"
                      onClick={() => executeSend(lastUserPromptRef.current)}
                      className="inline-flex items-center text-[11px] font-mono font-medium text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-white underline decoration-red-400 dark:decoration-red-600 hover:decoration-red-900 dark:hover:decoration-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 rounded transition-colors duration-150"
                    >
                      {t.retry}
                    </button>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Área de Entrada (Input Bar) com suporte a safe area mobile */}
          <div className="p-3 pb-[env(safe-area-inset-bottom,16px)] bg-neutral-50 dark:bg-[#0e0e11] border-t border-neutral-200 dark:border-neutral-800 shrink-0 [overflow-x:clip]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeSend(inputValue);
              }}
              className="space-y-2"
            >
              <div className="relative flex items-center bg-neutral-100 dark:bg-[#121215] border border-neutral-300 dark:border-neutral-800 focus-within:border-neutral-500 dark:focus-within:border-neutral-600 rounded-xl px-3 py-2 transition-colors duration-150">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.slice(0, 500))}
                  onKeyDown={handleKeyDown}
                  placeholder={t.input_placeholder}
                  disabled={isStreaming}
                  className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 resize-none outline-none focus:outline-none focus-visible:outline-none disabled:opacity-50 [overflow-x:clip]"
                />

                <div className="flex items-center gap-1.5 pl-2 shrink-0 self-end mb-0.5">
                  {isStreaming ? (
                    <button
                      type="button"
                      onClick={handleStopStream}
                      aria-label={t.stop_aria}
                      title={t.stop_aria}
                      className="p-1.5 rounded-lg bg-neutral-200 text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white transition-colors duration-150"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || inputValue.length > 500}
                      aria-label={t.send_aria}
                      title={t.send_aria}
                      className="p-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-400 transition-colors duration-150"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Rodapé com Contador de Caracteres e Disclaimer Factual */}
              <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 px-1 font-mono">
                <span className="truncate pr-2">{t.disclaimer}</span>
                <span
                  className={
                    inputValue.length >= 450
                      ? 'text-amber-600 dark:text-amber-400 font-semibold shrink-0'
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
