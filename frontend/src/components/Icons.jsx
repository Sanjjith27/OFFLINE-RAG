import React from 'react';

// Common SVG props helper
const defaultProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const IconPlus = (props) => (
  <svg {...defaultProps} {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const IconTrash = (props) => (
  <svg {...defaultProps} {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const IconSun = (props) => (
  <svg {...defaultProps} {...props}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

export const IconMoon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const IconPaperclip = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

export const IconSend = (props) => (
  <svg {...defaultProps} {...props}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export const IconSearch = (props) => (
  <svg {...defaultProps} {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const IconMenu = (props) => (
  <svg {...defaultProps} {...props}>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const IconX = (props) => (
  <svg {...defaultProps} {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const IconChevronLeft = (props) => (
  <svg {...defaultProps} {...props}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const IconChevronRight = (props) => (
  <svg {...defaultProps} {...props}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const IconBot = ({
  fill = '#ffffff',
  stroke = '#111827',
  eyeColor = '#111827',
  ...props
}) => (
  <svg
    {...defaultProps}
    {...props}
    fill="none"
    stroke={stroke}
    style={{ display: 'block' }}
  >
    {/* Main robot body with white fill */}
    <rect x="3" y="11" width="18" height="10" rx="2" fill={fill} stroke={stroke} strokeWidth={1.8} />
    {/* Antenna top circle with white fill */}
    <circle cx="12" cy="5" r="2" fill={fill} stroke={stroke} strokeWidth={1.8} />
    {/* Antenna stem */}
    <path d="M12 7v4" stroke={stroke} strokeWidth={1.8} />
    {/* Dark eyes */}
    <line x1="8" y1="16" x2="8" y2="16" stroke={eyeColor} strokeWidth={2.4} strokeLinecap="round" />
    <line x1="16" y1="16" x2="16" y2="16" stroke={eyeColor} strokeWidth={2.4} strokeLinecap="round" />
  </svg>
);

export const IconUser = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const IconMessageSquare = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const IconSparkles = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-2.9-6.1l-2.1 2.1m-8 8l-2.1 2.1m0-12.2l2.1 2.1m8 8l2.1 2.1" />
  </svg>
);

export const IconCheck = (props) => (
  <svg {...defaultProps} {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const IconAlertCircle = (props) => (
  <svg {...defaultProps} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export const IconCopy = (props) => (
  <svg {...defaultProps} {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const IconUploadCloud = (props) => (
  <svg {...defaultProps} {...props}>
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

export const IconFile = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export const IconFilePdf = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M9 13h2a1.5 1.5 0 0 0 0-3H9v6" />
  </svg>
);

export const IconFileText = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export const IconFileImage = (props) => (
  <svg {...defaultProps} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export const IconFileSpreadsheet = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
    <line x1="12" y1="13" x2="12" y2="17" />
  </svg>
);

export const IconFileCode = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <polyline points="10 12 8 14 10 16" />
    <polyline points="14 12 16 14 14 16" />
  </svg>
);

export const IconStop = (props) => (
  <svg {...defaultProps} {...props}>
    <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
  </svg>
);

export const IconSpinner = (props) => (
  <svg {...defaultProps} {...props} className="icon-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const IconFilePresentation = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M2 3h20v14H2z" />
    <path d="M8 21l4-4 4 4" />
    <path d="M7 8h10" />
    <path d="M7 12h6" />
  </svg>
);

export const IconFileWord = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M9 17l1.5-6 1.5 4.5 1.5-4.5 1.5 6" />
  </svg>
);

// Helper to return the best icon according to extension
export const getFileIcon = (filename = '', props = {}) => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf') return <IconFilePdf {...props} />;
  if (['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif'].includes(ext)) return <IconFileImage {...props} />;
  if (['csv', 'xlsx', 'xls'].includes(ext)) return <IconFileSpreadsheet {...props} />;
  if (['json', 'js', 'py', 'html', 'css'].includes(ext)) return <IconFileCode {...props} />;
  if (['pptx', 'ppt'].includes(ext)) return <IconFilePresentation {...props} />;
  if (['docx', 'doc'].includes(ext)) return <IconFileWord {...props} />;
  if (['txt', 'md'].includes(ext)) return <IconFileText {...props} />;
  return <IconFile {...props} />;
};
