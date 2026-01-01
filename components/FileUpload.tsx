import React, { useRef, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  acceptedFileTypes: string;
  promptText: string;
  maxFiles?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelect, acceptedFileTypes, promptText, maxFiles = 1 }) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);

    if (fileArray.length > maxFiles) {
        setUploadError(t('fileUpload.maxFilesError', { max: maxFiles }));
        return;
    }

    const acceptedTypesArray = acceptedFileTypes.split(',').map(type => type.trim());
    const validFiles: File[] = [];
    let hasInvalidType = false;

    for (const file of fileArray) {
        const fileType = file.type;
        const isAccepted = acceptedTypesArray.some(acceptedType => {
            if (acceptedType.endsWith('/*')) {
                return fileType.startsWith(acceptedType.slice(0, -1));
            }
            return fileType === acceptedType;
        });

        if (isAccepted) {
            validFiles.push(file);
        } else {
            hasInvalidType = true;
        }
    }
    
    if (hasInvalidType) {
        setUploadError(t('fileUpload.invalidType', { types: acceptedFileTypes.replace(/, /g, ', ') }));
    } else {
        setUploadError(null);
        onFilesSelect(validFiles);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border-4 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-300 ${
        isDragging ? 'border-brand-cyan bg-brand-cyan/10' : 
        uploadError ? 'border-red-500/50 bg-red-500/10' :
        'border-slate-600 hover:border-brand-cyan'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        multiple={maxFiles > 1}
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 transition-colors ${uploadError ? 'text-red-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        {uploadError ? (
          <p className="text-red-400 font-semibold">{uploadError}</p>
        ) : (
          <p className="text-slate-400">{t(promptText)}</p>
        )}
        <p className={`${uploadError ? 'text-red-400/80' : 'text-brand-cyan'} font-semibold`}>
          {uploadError ? t('fileUpload.tryAnother') : t('fileUpload.browse')}
        </p>
      </div>
    </div>
  );
};

export default FileUpload;