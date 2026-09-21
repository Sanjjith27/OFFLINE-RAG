import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  IconPlus,
  IconSearch,
  IconX,
  IconTrash,
  IconMessageSquare,
  IconBot,
  IconChevronLeft,
  getFileIcon,
} from './Icons';
import UploadButton from './UploadButton';
import ThemeToggle from './ThemeToggle';

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function Sidebar({
  isOpen,
  onClose,
  sessions = [],
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  uploadedDocs = [],
  onDeleteDoc,
  onUploadFile,
  isUploading,
  theme,
  toggleTheme,
  backendStatus,
}) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  // Auto-focus search input when search mode is activated
  useEffect(() => {
    if (isSearching) {
      searchInputRef.current?.focus();
    }
  }, [isSearching]);

  // Handle Escape key to close search mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearching) {
        setIsSearching(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearching]);

  // Fast, case-insensitive local chat search in title & messages
  const searchResults = useMemo(() => {
    if (!isSearching || !searchQuery.trim()) return [];
    const query = searchQuery.trim().toLowerCase();

    return sessions
      .map((sess) => {
        const titleMatches = (sess.title || '').toLowerCase().includes(query);

        let matchingSnippet = null;
        for (const msg of sess.messages || []) {
          const content = msg.content || '';
          const lower = content.toLowerCase();
          const matchIdx = lower.indexOf(query);
          if (matchIdx !== -1) {
            const start = Math.max(0, matchIdx - 18);
            const end = Math.min(content.length, matchIdx + query.length + 32);
            const prefix = start > 0 ? '...' : '';
            const suffix = end < content.length ? '...' : '';
            matchingSnippet = `${prefix}${content.substring(start, end).replace(/\n+/g, ' ')}${suffix}`;
            break;
          }
        }

        // Also check if any attached file name matches
        if (!matchingSnippet && !titleMatches) {
          for (const msg of sess.messages || []) {
            if (msg.file?.name && msg.file.name.toLowerCase().includes(query)) {
              matchingSnippet = `Document: ${msg.file.name}`;
              break;
            }
          }
        }

        if (titleMatches || matchingSnippet) {
          return {
            session: sess,
            snippet: matchingSnippet || (sess.messages?.[0]?.content?.slice(0, 48) || 'No messages'),
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [isSearching, searchQuery, sessions]);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar ${!isOpen ? 'collapsed' : ''}`} aria-label="Sidebar navigation">
        {/* Header Branding */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <IconBot width={18} height={18} />
            </div>
            <span>Universal RAG</span>
          </div>

          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <IconChevronLeft width={18} height={18} />
          </button>
        </div>

        {/* Action Buttons: + New Chat and 🔍 Search Chats */}
        <div className="sidebar-actions">
          <button
            type="button"
            className="sidebar-btn-new-chat"
            onClick={() => {
              onNewChat();
              if (isSearching) {
                setIsSearching(false);
                setSearchQuery('');
              }
              if (window.innerWidth <= 768) onClose();
            }}
          >
            <IconPlus width={16} height={16} />
            <span>New Chat</span>
          </button>

          {/* Search Bar / Trigger */}
          {!isSearching ? (
            <button
              type="button"
              className="sidebar-btn-search"
              onClick={() => setIsSearching(true)}
              title="Search previous chats"
              aria-label="Search previous chats"
            >
              <IconSearch width={15} height={15} />
              <span>Search Chats</span>
            </button>
          ) : (
            <div className="sidebar-search-container">
              <IconSearch width={14} height={14} className="sidebar-search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                className="sidebar-search-input"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search chats"
              />
              <button
                type="button"
                className="sidebar-search-clear"
                onClick={() => {
                  setIsSearching(false);
                  setSearchQuery('');
                }}
                title="Close search (Esc)"
                aria-label="Close search"
              >
                <IconX width={13} height={13} />
              </button>
            </div>
          )}
        </div>

        {/* Scrollable content */}
        <div className="sidebar-content">
          {/* Section: Search Results OR Recent Chats */}
          <div>
            <div className="sidebar-section-title">
              <span>{isSearching ? 'Search Results' : 'Recent'}</span>
              {isSearching && searchQuery.trim() && (
                <span className="sidebar-badge">{searchResults.length}</span>
              )}
            </div>

            {isSearching ? (
              searchQuery.trim() === '' ? (
                <div className="sidebar-empty-hint">Type to search title and messages...</div>
              ) : searchResults.length === 0 ? (
                <div className="sidebar-empty-hint" style={{ textAlign: 'center', padding: '16px 8px' }}>
                  No chats found
                </div>
              ) : (
                <div className="sidebar-list">
                  {searchResults.map(({ session: sess, snippet }) => {
                    const isActive = sess.id === activeSessionId;
                    return (
                      <div
                        key={sess.id}
                        className={`sidebar-search-result-item ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          onSelectSession(sess.id);
                          if (window.innerWidth <= 768) onClose();
                        }}
                        title={sess.title}
                      >
                        <div className="search-result-title-row">
                          <IconMessageSquare width={13} height={13} style={{ flexShrink: 0 }} />
                          <span className="search-result-title">{sess.title || 'Untitled chat'}</span>
                        </div>
                        <div className="search-result-snippet">{snippet}</div>
                        {sess.updatedAt && (
                          <div className="search-result-date">
                            {formatRelativeTime(sess.updatedAt)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            ) : sessions.length === 0 ? (
              <div className="sidebar-empty-hint">No past conversations.</div>
            ) : (
              <div className="sidebar-list">
                {sessions.map((sess) => {
                  const isActive = sess.id === activeSessionId;
                  return (
                    <div
                      key={sess.id}
                      className={`sidebar-item ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        onSelectSession(sess.id);
                        if (window.innerWidth <= 768) onClose();
                      }}
                      title={sess.title}
                    >
                      <div className="sidebar-item-content">
                        <IconMessageSquare width={14} height={14} />
                        <span className="sidebar-item-title">{sess.title || 'Untitled chat'}</span>
                      </div>

                      <div className="sidebar-item-actions">
                        <button
                          type="button"
                          className="sidebar-item-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(sess.id);
                          }}
                          title="Delete chat"
                          aria-label="Delete chat"
                        >
                          <IconTrash width={13} height={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Documents */}
          <div>
            <div className="sidebar-section-title">
              <span>Documents ({uploadedDocs.length})</span>
            </div>

            {uploadedDocs.length === 0 ? (
              <div className="sidebar-empty-hint">
                No documents uploaded yet. Upload a PDF, TXT, DOCX, or image to start.
              </div>
            ) : (
              <div className="sidebar-list">
                {uploadedDocs.map((doc, idx) => (
                  <div key={idx} className="sidebar-item" title={doc.name}>
                    <div className="sidebar-item-content">
                      <span style={{ color: 'var(--text-secondary)', display: 'flex' }}>
                        {getFileIcon(doc.name, { width: 14, height: 14 })}
                      </span>
                      <span className="sidebar-item-title">{doc.name}</span>
                      {doc.type && <span className="sidebar-badge">{doc.type}</span>}
                    </div>

                    <div className="sidebar-item-actions">
                      <button
                        type="button"
                        className="sidebar-item-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDoc(doc.name);
                        }}
                        title="Remove from list"
                        aria-label={`Remove ${doc.name}`}
                      >
                        <IconTrash width={13} height={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '8px' }}>
              <UploadButton
                onFileSelected={onUploadFile}
                isUploading={isUploading}
                label="+ Upload Document"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-status-pill">
            <span
              className={`status-dot ${backendStatus === 'connected' ? '' : 'error'}`}
            />
            <span>{backendStatus === 'connected' ? 'Backend Ready' : 'Connecting...'}</span>
          </div>

          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </aside>
    </>
  );
}
