import React, { useState } from 'react';
import SourceCard from './SourceCard';
import DocumentCard from './DocumentCard';
import { IconBot, IconUser, IconCopy, IconCheck } from './Icons';

// Simple text formatter that preserves linebreaks, bolds **text**, and handles `code` blocks
function FormattedContent({ text }) {
  if (!text) return null;

  // Split by code blocks first
  const codeBlockParts = text.split(/(```[\s\S]*?```)/g);

  return (
    <>
      {codeBlockParts.map((block, bIdx) => {
        if (block.startsWith('```') && block.endsWith('```')) {
          const lines = block.slice(3, -3).trim().split('\n');
          const firstLine = lines[0]?.trim();
          const hasLang = firstLine && !firstLine.includes(' ') && lines.length > 1;
          const code = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

          return (
            <pre key={bIdx}>
              <code>{code}</code>
            </pre>
          );
        }

        // Normal text with inline markdown
        const lines = block.split('\n');
        return (
          <React.Fragment key={bIdx}>
            {lines.map((line, lIdx) => {
              const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

              return (
                <React.Fragment key={lIdx}>
                  {parts.map((part, pIdx) => {
                    if (part.startsWith('`') && part.endsWith('`')) {
                      return <code key={pIdx}>{part.slice(1, -1)}</code>;
                    }
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                  {lIdx < lines.length - 1 && '\n'}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
}

// Deduplicate sources
function deduplicateSources(sources = []) {
  const seen = new Set();
  const deduped = [];

  for (const s of sources) {
    if (!s || !s.source) continue;
    const key = `${s.source}__${s.page || ''}__${s.type || ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(s);
    }
  }
  return deduped;
}

export default function Message({ message, isThinking }) {
  const isUser = message.role === 'user';
  const sources = deduplicateSources(message.sources || []);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`message-row ${isUser ? 'user' : 'assistant'}`}>
      {!isUser && (
        <div className="message-avatar assistant">
          <IconBot width={18} height={18} />
        </div>
      )}

      <div className="message-bubble-wrapper">
        {/* If message has an attached uploaded document card */}
        {message.file && (
          <DocumentCard file={message.file} />
        )}

        {/* Text bubble (only show if content exists or if thinking) */}
        {(message.content || isThinking) && (
          <div className="message-bubble">
            {isThinking ? (
              <div className="thinking-indicator">
                <span>Thinking</span>
                <div className="thinking-dots">
                  <div className="thinking-dot" />
                  <div className="thinking-dot" />
                  <div className="thinking-dot" />
                </div>
              </div>
            ) : (
              <FormattedContent text={message.content} />
            )}
          </div>
        )}

        {/* Copy button on assistant response */}
        {!isUser && !isThinking && message.content && (
          <div style={{ display: 'flex', gap: '8px', paddingLeft: '2px', marginTop: '2px' }}>
            <button
              type="button"
              className="btn-icon"
              onClick={handleCopy}
              title={copied ? 'Copied!' : 'Copy response'}
              style={{ padding: '3px 6px', fontSize: '11.5px', gap: '4px', height: '24px' }}
            >
              {copied ? (
                <>
                  <IconCheck width={13} height={13} style={{ color: 'var(--success)' }} />
                  <span style={{ color: 'var(--success)' }}>Copied</span>
                </>
              ) : (
                <>
                  <IconCopy width={13} height={13} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Sources underneath assistant response */}
        {!isUser && !isThinking && sources.length > 0 && (
          <div className="sources-container">
            <div className="sources-header">
              <span>Sources ({sources.length})</span>
            </div>
            <div className="sources-grid">
              {sources.map((src, idx) => (
                <SourceCard key={idx} source={src} />
              ))}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="message-avatar user">
          <IconUser width={18} height={18} />
        </div>
      )}
    </div>
  );
}
