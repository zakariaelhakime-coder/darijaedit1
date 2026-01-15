
import React from 'react';
import { EditorStatus } from '../types/editor';

interface ProcessingStatusProps {
  status: EditorStatus;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status }) => {
  const getStatusText = () => {
    switch(status) {
      case EditorStatus.UPLOADING: return "Ingesting Stream Assets";
      case EditorStatus.ANALYZING: return "Neural Semantic Analysis";
      case EditorStatus.EDITING: return "Synthesizing Darija Script";
      default: return "Processing";
    }
  };

  const getSubText = () => {
    switch(status) {
      case EditorStatus.UPLOADING: return "Establishing secure uplink for high-bitrate video processing...";
      case EditorStatus.ANALYZING: return "Detecting languages and identifying silence nodes in the waveform...";
      case EditorStatus.EDITING: return "Rewriting script for maximum impact. Applying modern Darija styling...";
      default: return "";
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-[#09090b]">
      <div className="relative mb-12">
        <div className="w-32 h-32 border-4 border-zinc-800 rounded-full animate-[spin_3s_linear_infinite]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-blue-600/10 rounded-full animate-pulse border border-blue-500/20" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
           <svg className="w-10 h-10 text-blue-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
           </svg>
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold tracking-tight text-white uppercase">{getStatusText()}</h2>
        <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed italic">{getSubText()}</p>
      </div>

      <div className="mt-12 w-64 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
        <div className="h-full bg-blue-600 w-1/3 animate-[loading_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default ProcessingStatus;
