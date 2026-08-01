'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, File, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  className?: string;
}

export function FileUpload({ 
  onUpload, 
  accept = '*/*', 
  maxSizeMB = 10, 
  label = 'اسحب الملفات هنا أو انقر للاختيار',
  className
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndProcessFile = (file: File) => {
    setError(null);
    
    // Check size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`حجم الملف يتجاوز الحد الأقصى (${maxSizeMB}MB)`);
      return;
    }

    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    // Simulate upload
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onUpload(file);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setError(null);
    setUploadProgress(0);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className={cn("w-full", className)}>
      {!selectedFile ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-900/40 backdrop-blur-sm group",
            isDragging 
              ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
              : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/50",
            error ? "border-rose-500/50 bg-rose-500/5" : ""
          )}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept={accept} 
            className="hidden" 
          />
          
          <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className={cn("w-7 h-7", isDragging ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-400")} />
          </div>
          
          <h4 className="text-sm font-bold text-slate-200 mb-2">{label}</h4>
          <p className="text-xs text-slate-500">
            صور، مستندات، PDF — حد أقصى {maxSizeMB}MB
          </p>

          {error && (
            <div className="mt-4 flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-sm">
          {/* Preview/Icon */}
          <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : selectedFile.type.startsWith('image/') ? (
              <ImageIcon className="w-5 h-5 text-emerald-400" />
            ) : (
              <File className="w-5 h-5 text-indigo-400" />
            )}
          </div>
          
          {/* Info & Progress */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <p className="text-sm font-medium text-slate-200 truncate pr-4">{selectedFile.name}</p>
              {!isUploading && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
            </div>
            
            <p className="text-xs text-slate-500 mb-2">{formatFileSize(selectedFile.size)}</p>
            
            {isUploading && (
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
          
          {/* Actions */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearSelection}
            disabled={isUploading}
            className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-full shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
