import React, { useRef } from 'react';
import { IconUploadCloud } from './Icons';

export const ACCEPTED_FILE_TYPES = '.pdf,.docx,.pptx,.txt,.csv,.xlsx,.xls,.json,.png,.jpg,.jpeg';

export default function UploadButton({ onFileSelected, isUploading, label = 'Upload Document' }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onFileSelected) {
      onFileSelected(file);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept={ACCEPTED_FILE_TYPES}
        style={{ display: 'none' }}
      />
      <button
        type="button"
        className="sidebar-btn-new-chat"
        onClick={handleClick}
        disabled={isUploading}
        style={{
          background: 'transparent',
          borderStyle: 'dashed',
          color: 'var(--text-secondary)',
          fontSize: '13px',
          padding: '8px 12px'
        }}
      >
        <IconUploadCloud width={16} height={16} />
        <span>{isUploading ? 'Uploading...' : label}</span>
      </button>
    </>
  );
}
