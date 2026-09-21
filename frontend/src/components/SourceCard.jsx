import React from 'react';
import { getFileIcon } from './Icons';

export default function SourceCard({ source }) {
  if (!source) return null;

  const filename = source.source || 'Document';
  const docType = source.type || (filename.includes('.') ? filename.split('.').pop() : '');
  const hasPage = source.page && source.page !== 'None' && source.page !== 'null' && source.page !== 'undefined';

  return (
    <div className="source-card" title={filename}>
      <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
        {getFileIcon(filename, { width: 14, height: 14 })}
      </span>

      <span className="source-name">{filename}</span>

      {docType && (
        <span className="sidebar-badge">{docType}</span>
      )}

      {hasPage && (
        <span className="source-page">p. {source.page}</span>
      )}
    </div>
  );
}
