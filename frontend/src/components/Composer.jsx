import React, { useRef, useEffect } from 'react';
import { IconPaperclip, IconSend, IconStop, IconX, getFileIcon } from './Icons';
import { ACCEPTED_FILE_TYPES } from './UploadButton';

export default function Composer({
  input,
  setInput,
  onSend,
  onStop,
  isLoading,
  stagedFile,
  setStagedFile,
  onUploadStagedFile,
  isUploading,
}) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize textarea as content changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (isLoading || isUploading) return;

    // If there is a staged file and text, or just text
    if (stagedFile && !input.trim()) {
      // User only attached a file without text - trigger upload
      onUploadStagedFile();
      return;
    }

    if (!input.trim() && !stagedFile) return;

    onSend();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setStagedFile(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const canSend = (input.trim().length > 0 || stagedFile) && !isLoading && !isUploading;

  return (
    <div className="composer-area">
      <div className="composer-wrapper">
        {/* Hidden file input for attachment button */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={ACCEPTED_FILE_TYPES}
          style={{ display: 'none' }}
        />

        {/* Staged file chip */}
        {stagedFile && (
          <div className="staged-file-chip">
            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--accent)' }}>
              {getFileIcon(stagedFile.name, { width: 16, height: 16 })}
            </span>
            <span className="staged-file-name">{stagedFile.name}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              ({formatFileSize(stagedFile.size)})
            </span>

            <button
              type="button"
              className="staged-file-remove"
              onClick={() => {
                setStagedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              title="Remove attachment"
            >
              <IconX width={14} height={14} />
            </button>

            {!input.trim() && (
              <button
                type="button"
                onClick={onUploadStagedFile}
                disabled={isUploading}
                style={{
                  marginLeft: '4px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: '11.5px',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  fontWeight: 500,
                }}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            )}
          </div>
        )}

        {/* Textarea Box */}
        <div className="composer-box">
          <button
            type="button"
            className="composer-btn-attach"
            onClick={() => fileInputRef.current?.click()}
            title="Attach document or image"
            aria-label="Attach file"
            disabled={isLoading || isUploading}
          >
            <IconPaperclip width={19} height={19} />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            className="composer-textarea"
            placeholder={
              isLoading
                ? 'Generating answer...'
                : stagedFile
                ? `Ask about ${stagedFile.name} or press Send to upload...`
                : 'Ask anything about your uploaded documents...'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isUploading}
          />

          {/* If generating: Show STOP button. Otherwise show SEND button */}
          {isLoading ? (
            <button
              type="button"
              className="composer-btn-stop"
              onClick={onStop}
              title="Stop generation"
              aria-label="Stop generation"
            >
              <IconStop width={14} height={14} />
            </button>
          ) : (
            <button
              type="button"
              className="composer-btn-send"
              onClick={handleSubmit}
              disabled={!canSend}
              title="Send message (Enter)"
              aria-label="Send message"
            >
              <IconSend width={16} height={16} />
            </button>
          )}
        </div>

        <div className="composer-footnote">
          Universal RAG runs locally and privately using ChromaDB & Granite.
        </div>
      </div>
    </div>
  );
}
