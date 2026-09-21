import React from 'react';
import {
  getFileIcon,
  IconCheck,
  IconAlertCircle,
  IconSpinner,
} from './Icons';

function formatBytes(bytes) {
  if (!bytes || isNaN(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentCard({ file }) {
  if (!file) return null;

  const filename = file.name || 'document';
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const isImage = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif'].includes(ext);
  const status = file.status || 'Uploaded';
  const sizeText = formatBytes(file.size);

  const displayType = (file.type || ext).toUpperCase();

  return (
    <div className={`document-chat-card ${status.toLowerCase()}`}>
      {/* Thumbnail or Icon */}
      <div className="document-card-preview">
        {isImage && file.previewUrl ? (
          <img
            src={file.previewUrl}
            alt={filename}
            className="document-card-img-thumb"
          />
        ) : (
          <div className="document-card-icon-wrap">
            {getFileIcon(filename, { width: 22, height: 22 })}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="document-card-info">
        <div className="document-card-filename" title={filename}>
          {filename}
        </div>

        <div className="document-card-meta">
          <span className="document-card-badge">{displayType}</span>

          {sizeText && (
            <span className="document-card-size">{sizeText}</span>
          )}

          {/* Status Indicator */}
          <span className={`document-card-status ${status.toLowerCase()}`}>
            {status === 'Uploading...' && (
              <>
                <IconSpinner width={12} height={12} />
                <span>Uploading...</span>
              </>
            )}
            {status === 'Uploaded' && (
              <>
                <IconCheck width={12} height={12} style={{ color: 'var(--success)' }} />
                <span style={{ color: 'var(--success)' }}>Uploaded</span>
              </>
            )}
            {status === 'Failed' && (
              <>
                <IconAlertCircle width={12} height={12} style={{ color: 'var(--danger)' }} />
                <span style={{ color: 'var(--danger)' }}>Failed</span>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
