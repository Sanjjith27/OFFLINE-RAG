import React, { useRef, useEffect, useState } from 'react';
import Message from './Message';
import Composer from './Composer';
import {
  IconMenu,
  IconPlus,
  IconBot,
  IconUploadCloud,
  IconSparkles,
} from './Icons';
import ThemeToggle from './ThemeToggle';

const STARTER_PROMPTS = [
  {
    title: 'Summarize document',
    desc: 'Get an overview of key points and conclusions',
    prompt: 'Can you summarize the main points and key takeaways from the uploaded document?',
  },
  {
    title: 'List use cases or features',
    desc: 'Extract applications and specific capabilities',
    prompt: 'What are all the use cases and features described in the document?',
  },
  {
    title: 'Explain in detail',
    desc: 'Deep-dive into methodology or architecture',
    prompt: 'Explain the core workflow and architecture in detail.',
  },
  {
    title: 'Extract key data points',
    desc: 'Locate metrics, tables, and important numbers',
    prompt: 'What are the key metrics, numbers, or data points mentioned?',
  },
];

export default function ChatArea({
  isSidebarOpen,
  onToggleSidebar,
  sessionTitle,
  messages = [],
  isLoading,
  input,
  setInput,
  onSend,
  onStop,
  stagedFile,
  setStagedFile,
  onUploadStagedFile,
  onUploadFile,
  isUploading,
  theme,
  toggleTheme,
  onNewChat,
}) {
  const messagesEndRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-scroll to bottom whenever messages change or loading begins
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Drag and Drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only turn off if leaving the window/container
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const file = droppedFiles[0];
      // Directly upload the dropped file
      if (onUploadFile) {
        onUploadFile(file);
      }
    }
  };

  return (
    <main
      className="chat-container"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div className="dropzone-overlay">
          <div className="dropzone-box">
            <IconUploadCloud width={36} height={36} style={{ color: 'var(--accent)' }} />
            <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)' }}>
              Drop document to upload
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              PDF, DOCX, PPTX, TXT, CSV, JSON, PNG, JPG supported
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-left">
          <button
            type="button"
            className="btn-icon"
            onClick={onToggleSidebar}
            title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-label="Toggle sidebar"
          >
            <IconMenu width={18} height={18} />
          </button>

          <span className="chat-header-title">
            {sessionTitle || 'Universal RAG Assistant'}
          </span>
        </div>

        <div className="chat-header-right">
          <button
            type="button"
            className="btn-icon"
            onClick={onNewChat}
            title="New Chat"
            aria-label="New Chat"
          >
            <IconPlus width={18} height={18} />
          </button>

          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </header>

      {/* Scrollable Messages Area */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="welcome-container">
            <div className="welcome-logo">
              <IconBot width={28} height={28} />
            </div>

            <h1 className="welcome-title">Universal RAG Assistant</h1>
            <p className="welcome-subtitle">
              Chat with your documents privately and locally.
            </p>

            <div className="welcome-prompts-grid">
              {STARTER_PROMPTS.map((item, idx) => (
                <div
                  key={idx}
                  className="welcome-prompt-card"
                  onClick={() => {
                    setInput(item.prompt);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <IconSparkles width={14} height={14} style={{ color: 'var(--accent)' }} />
                    <span className="prompt-card-title">{item.title}</span>
                  </div>
                  <span className="prompt-card-desc">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="chat-messages-inner">
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}

            {isLoading && (
              <Message
                key="thinking"
                message={{ role: 'assistant', content: '' }}
                isThinking={true}
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Sticky Bottom Composer */}
      <Composer
        input={input}
        setInput={setInput}
        onSend={onSend}
        onStop={onStop}
        isLoading={isLoading}
        stagedFile={stagedFile}
        setStagedFile={setStagedFile}
        onUploadStagedFile={onUploadStagedFile}
        isUploading={isUploading}
      />
    </main>
  );
}
