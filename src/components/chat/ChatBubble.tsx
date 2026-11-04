import React from 'react';

export interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  timestamp?: string;
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Regex matching **bold** and `code`
  const regex = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(
        <strong key={match.index} className="font-semibold text-neutral-900 dark:text-white">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      parts.push(
        <code
          key={match.index}
          className="font-mono text-[11px] sm:text-xs px-1.5 py-0.5 rounded bg-neutral-200/80 text-neutral-900 border border-neutral-300 dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-200"
        >
          {match[3]}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function renderContent(content: string, isStreaming?: boolean): React.ReactNode {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];

  const flushList = (key: number) => {
    if (currentList.length > 0) {
      elements.push(
        <ul
          key={`ul-${key}`}
          className="space-y-1.5 my-1.5 pl-4 list-disc list-outside text-neutral-700 dark:text-neutral-300"
        >
          {currentList.map((item, idx) => (
            <li key={idx} className="text-xs sm:text-sm leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const flushCode = (key: number) => {
    if (codeBlockLines.length > 0) {
      elements.push(
        <div
          key={`code-${key}`}
          className="my-2 p-2.5 rounded bg-neutral-200/80 text-neutral-900 border border-neutral-300 dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-200 overflow-x-auto [overflow-x:clip] font-mono text-[11px] sm:text-xs"
        >
          <pre className="overflow-x-auto">{codeBlockLines.join('\n')}</pre>
        </div>
      );
      codeBlockLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        flushCode(i);
      } else {
        flushList(i);
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      continue;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      currentList.push(trimmed.slice(2));
      continue;
    }

    flushList(i);

    if (trimmed.length === 0) {
      continue;
    }

    elements.push(
      <p key={`p-${i}`} className="text-xs sm:text-sm leading-relaxed text-inherit">
        {renderInline(rawLine)}
      </p>
    );
  }

  flushList(lines.length);
  flushCode(lines.length);

  return (
    <div className="space-y-1.5">
      {elements}
      {isStreaming && (
        <span
          className="inline-block w-1.5 h-3.5 bg-neutral-600 dark:bg-neutral-400 ml-1.5 animate-pulse align-middle motion-reduce:animate-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  role,
  content,
  isStreaming = false,
  timestamp,
}) => {
  const isUser = role === 'user';

  return (
    <div
      className={`flex flex-col ${
        isUser ? 'items-end' : 'items-start'
      } max-w-full [overflow-wrap:anywhere] [overflow-x:clip]`}
    >
      <div
        className={`px-3.5 py-2.5 rounded-2xl max-w-[88%] sm:max-w-[84%] transition-colors duration-150 ${
          isUser
            ? 'bg-neutral-900 text-white dark:bg-neutral-800 dark:text-white border border-neutral-800 dark:border-neutral-700/60 rounded-tr-xs'
            : 'bg-neutral-100 border border-neutral-200 text-neutral-800 dark:bg-[#121215] dark:border-neutral-800 dark:text-neutral-200 rounded-tl-xs'
        }`}
      >
        {renderContent(content, isStreaming)}
      </div>
      {timestamp && (
        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 select-none font-mono px-1">
          {timestamp}
        </span>
      )}
    </div>
  );
};
