import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { IconCheck, IconAlertCircle } from './components/Icons';

const API_BASE = 'http://127.0.0.1:8000';
const SESSIONS_STORAGE_KEY = 'universal_rag_sessions';
const DOCS_STORAGE_KEY = 'universal_rag_docs';
const THEME_STORAGE_KEY = 'universal_rag_theme';

export function generateChatTitle(question = '') {
  if (!question || !question.trim()) return 'New Chat';

  const text = question.trim();

  // Explicit user requirement matching
  if (/^what\s+are\s+the\s+use\s+cases\s+in\s+this\s+document\??$/i.test(text)) {
    return 'Document use cases';
  }
  if (/^what\s+is\s+machine\s+learning\??$/i.test(text)) {
    return 'Machine learning';
  }

  // Remove common prefix question words
  const prefixes = [
    /^what\s+(is|are|was|were)\s+(the\s+)?/i,
    /^can\s+you\s+(please\s+)?(tell\s+me\s+about|explain|describe|summarize)\s+(the\s+)?/i,
    /^could\s+you\s+(please\s+)?/i,
    /^tell\s+me\s+(about\s+)?/i,
    /^explain\s+(the\s+)?/i,
    /^how\s+(do|does|can|to)\s+/i,
    /^summarize\s+(the\s+)?/i,
    /^who\s+(is|was|are)\s+/i,
    /^where\s+(is|are)\s+/i,
    /^please\s+/i,
  ];

  let cleaned = text;
  for (const regex of prefixes) {
    if (regex.test(cleaned)) {
      cleaned = cleaned.replace(regex, '');
      break;
    }
  }

  cleaned = cleaned.replace(/[\?\.\!]+$/, '').trim();

  if (/^use cases in this document$/i.test(cleaned)) {
    cleaned = 'Document use cases';
  }

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  } else {
    cleaned = text;
  }

  if (cleaned.length > 36) {
    cleaned = cleaned.substring(0, 36).trim() + '...';
  }

  return cleaned || 'New Chat';
}

function createNewSession() {
  const now = new Date().toISOString();
  return {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    title: 'New Chat',
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

export default function App() {
  // -------------------------------------------------------------
  // Theme state
  // -------------------------------------------------------------
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // -------------------------------------------------------------
  // Layout state
  // -------------------------------------------------------------
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768;
    }
    return true;
  });

  // -------------------------------------------------------------
  // Backend health status
  // -------------------------------------------------------------
  const [backendStatus, setBackendStatus] = useState('connecting');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await axios.get(`${API_BASE}/health`, { timeout: 3000 });
        if (res.data?.status === 'healthy') {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      } catch (err) {
        setBackendStatus('error');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  // -------------------------------------------------------------
  // Sessions & Messages state
  // -------------------------------------------------------------
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse sessions from localStorage', e);
    }
    return [createNewSession()];
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    return sessions[0]?.id || '';
  });

  // Keep sessions synced to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions to localStorage', e);
    }
  }, [sessions]);

  // Current active session
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // -------------------------------------------------------------
  // Uploaded Documents state
  // -------------------------------------------------------------
  const [uploadedDocs, setUploadedDocs] = useState(() => {
    try {
      const saved = localStorage.getItem(DOCS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse docs from localStorage', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(uploadedDocs));
    } catch (e) {
      console.error('Failed to save docs to localStorage', e);
    }
  }, [uploadedDocs]);

  // -------------------------------------------------------------
  // Toast & Composer state
  // -------------------------------------------------------------
  const [input, setInput] = useState('');
  const [stagedFile, setStagedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);

  // Reference to abort in-flight question requests
  const abortControllerRef = useRef(null);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  // -------------------------------------------------------------
  // Handlers: Sessions
  // -------------------------------------------------------------
  const handleNewChat = () => {
    if (activeSession && activeSession.messages.length === 0) {
      return;
    }
    const newSess = createNewSession();
    setSessions((prev) => [newSess, ...prev]);
    setActiveSessionId(newSess.id);
    setInput('');
    setStagedFile(null);
  };

  const handleSelectSession = (id) => {
    setActiveSessionId(id);
  };

  const handleDeleteSession = (id) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const fresh = createNewSession();
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === id) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  // -------------------------------------------------------------
  // Handlers: File Upload
  // -------------------------------------------------------------
  const handleUploadFile = async (fileToUpload) => {
    const targetFile = fileToUpload || stagedFile;
    if (!targetFile) {
      showToast('Please select a file to upload.', 'error');
      return false;
    }

    const docType = targetFile.name.split('.').pop()?.toUpperCase() || '';
    const isImage = ['PNG', 'JPG', 'JPEG', 'WEBP', 'BMP', 'GIF'].includes(docType);
    const previewUrl = isImage && targetFile instanceof Blob ? URL.createObjectURL(targetFile) : null;

    const uploadMsgId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const uploadDocMessage = {
      id: uploadMsgId,
      role: 'user',
      content: '',
      file: {
        name: targetFile.name,
        size: targetFile.size,
        type: docType,
        status: 'Uploading...',
        previewUrl: previewUrl,
      },
      timestamp: new Date().toISOString(),
    };

    // Add document card into conversation immediately
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            messages: [...s.messages, uploadDocMessage],
          };
        }
        return s;
      })
    );

    const formData = new FormData();
    formData.append('file', targetFile);

    try {
      setIsUploading(true);
      showToast(`Uploading ${targetFile.name}...`, 'info', 10000);

      const response = await axios.post(`${API_BASE}/upload`, formData);
      const data = response.data || {};
      const chunkCount = data.chunks ? ` (${data.chunks} chunks)` : '';
      const successMsg = data.message || `Uploaded ${targetFile.name}${chunkCount}`;

      showToast(successMsg, 'success');

      // Update message card status to 'Uploaded'
      setSessions((prev) =>
        prev.map((s) => ({
          ...s,
          messages: s.messages.map((m) =>
            m.id === uploadMsgId
              ? {
                  ...m,
                  file: {
                    ...m.file,
                    status: 'Uploaded',
                  },
                }
              : m
          ),
        }))
      );

      // Add to uploaded docs list in sidebar
      setUploadedDocs((prev) => {
        const filtered = prev.filter((d) => d.name !== targetFile.name);
        return [
          { name: targetFile.name, type: docType, uploadedAt: new Date().toISOString() },
          ...filtered,
        ];
      });

      // Clear staged file
      setStagedFile(null);
      return true;
    } catch (error) {
      console.error('Upload Error:', error);
      const errMsg =
        error.response?.data?.detail ||
        error.response?.statusText ||
        'Upload failed. Check FastAPI backend.';
      showToast(`Upload failed: ${errMsg}`, 'error');

      // Update message card status to 'Failed'
      setSessions((prev) =>
        prev.map((s) => ({
          ...s,
          messages: s.messages.map((m) =>
            m.id === uploadMsgId
              ? {
                  ...m,
                  file: {
                    ...m.file,
                    status: 'Failed',
                  },
                }
              : m
          ),
        }))
      );
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDoc = (docName) => {
    setUploadedDocs((prev) => prev.filter((d) => d.name !== docName));
  };

  // -------------------------------------------------------------
  // Handlers: Stop Generation
  // -------------------------------------------------------------
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    showToast('Generation stopped.', 'info', 2000);
  };

  // -------------------------------------------------------------
  // Handlers: Ask Question
  // -------------------------------------------------------------
  const handleSend = async () => {
    const questionText = input.trim();
    let attachedFile = null;

    // If there is a staged file, handle it
    if (stagedFile) {
      attachedFile = stagedFile;
      const uploadSuccess = await handleUploadFile(stagedFile);
      if (!uploadSuccess && !questionText) {
        return;
      }
    }

    if (!questionText) return;

    const userMessage = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      content: questionText,
      timestamp: new Date().toISOString(),
    };

    // Update session title if first message or still default "New Chat"
    const isFirstMessage = activeSession.messages.length === 0;
    const newTitle =
      isFirstMessage || activeSession.title === 'New Chat'
        ? generateChatTitle(questionText)
        : activeSession.title;

    const now = new Date().toISOString();

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            title: newTitle,
            updatedAt: now,
            messages: [...s.messages, userMessage],
          };
        }
        return s;
      })
    );

    setInput('');
    setIsLoading(true);

    // Setup AbortController for cancellation
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await axios.post(
        `${API_BASE}/ask`,
        { question: questionText },
        { signal: controller.signal }
      );

      const answer = response.data?.answer || 'No answer received from backend.';
      const sources = response.data?.sources || [];

      const assistantMessage = {
        id: `msg_${Date.now()}_a`,
        role: 'assistant',
        content: answer,
        sources: sources,
        timestamp: new Date().toISOString(),
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSession.id) {
            return {
              ...s,
              updatedAt: new Date().toISOString(),
              messages: [...s.messages, assistantMessage],
            };
          }
          return s;
        })
      );

      // Auto-discover sources into sidebar docs list if new
      if (Array.isArray(sources) && sources.length > 0) {
        setUploadedDocs((prev) => {
          const existingNames = new Set(prev.map((d) => d.name));
          const newDocs = [];
          for (const src of sources) {
            if (src.source && !existingNames.has(src.source)) {
              existingNames.add(src.source);
              const docType = src.type ? src.type.toUpperCase() : (src.source.split('.').pop()?.toUpperCase() || '');
              newDocs.push({
                name: src.source,
                type: docType,
                uploadedAt: new Date().toISOString(),
              });
            }
          }
          return newDocs.length > 0 ? [...prev, ...newDocs] : prev;
        });
      }
    } catch (error) {
      if (axios.isCancel(error) || error.name === 'CanceledError' || error.name === 'AbortError') {
        console.log('Generation cancelled by user');
        const stoppedMessage = {
          id: `msg_${Date.now()}_stopped`,
          role: 'assistant',
          content: '[Response generation stopped]',
          sources: [],
          timestamp: new Date().toISOString(),
        };

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === activeSession.id) {
              return {
                ...s,
                messages: [...s.messages, stoppedMessage],
              };
            }
            return s;
          })
        );
      } else {
        console.error('Ask Error:', error);
        const errMsg =
          error.response?.data?.detail ||
          (error.response ? `Backend error (${error.response.status})` : 'Could not connect to FastAPI backend.');

        const errorMessage = {
          id: `msg_${Date.now()}_err`,
          role: 'assistant',
          content: `Error: ${errMsg}`,
          sources: [],
          timestamp: new Date().toISOString(),
        };

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === activeSession.id) {
              return {
                ...s,
                messages: [...s.messages, errorMessage],
              };
            }
            return s;
          })
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="app-layout">
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`toast-banner ${toast.type}`}>
          {toast.type === 'success' && <IconCheck width={16} height={16} />}
          {toast.type === 'error' && <IconAlertCircle width={16} height={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSession?.id}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        uploadedDocs={uploadedDocs}
        onDeleteDoc={handleDeleteDoc}
        onUploadFile={handleUploadFile}
        isUploading={isUploading}
        theme={theme}
        toggleTheme={toggleTheme}
        backendStatus={backendStatus}
      />

      {/* Main Chat Area */}
      <ChatArea
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        sessionTitle={activeSession?.title}
        messages={activeSession?.messages || []}
        isLoading={isLoading}
        input={input}
        setInput={setInput}
        onSend={handleSend}
        onStop={handleStop}
        stagedFile={stagedFile}
        setStagedFile={setStagedFile}
        onUploadStagedFile={() => handleUploadFile(stagedFile)}
        onUploadFile={handleUploadFile}
        isUploading={isUploading}
        theme={theme}
        toggleTheme={toggleTheme}
        onNewChat={handleNewChat}
      />
    </div>
  );
}