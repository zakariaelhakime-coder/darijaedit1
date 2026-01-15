
import React, { useState } from 'react';

interface UploadZoneProps {
  onUpload: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('video/')) {
      onUpload(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-3xl p-12
          transition-all duration-300 ease-out
          ${isDragging 
            ? 'border-blue-500 bg-blue-500/5 scale-[1.02]' 
            : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50'}
        `}
      >
        <input 
          type="file" 
          accept="video/*" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
        
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-10 h-10 text-zinc-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 tracking-tight">Drop your video here</h2>
          <p className="text-zinc-500 mb-8 max-w-sm">
            Import your footage in any language. DarijaPro will detect, cut, and rewrite it perfectly.
          </p>
          
          <div className="flex gap-4 items-center">
            <span className="h-px w-8 bg-zinc-800"></span>
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em]">Format Support</span>
            <span className="h-px w-8 bg-zinc-800"></span>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {['Reels (9:16)', 'YouTube (16:9)', '4K UHD', 'Multiple Languages'].map(label => (
              <span key={label} className="px-3 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-[10px] font-bold text-zinc-400 uppercase">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;
