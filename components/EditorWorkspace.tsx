
import React, { useState, useRef, useEffect } from 'react';
import { VideoFile, EditMetadata, Subtitle } from '../types/editor';

interface EditorWorkspaceProps {
  video: VideoFile;
  metadata: EditMetadata;
}

const EditorWorkspace: React.FC<EditorWorkspaceProps> = ({ video, metadata }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      
      const sub = metadata.subtitles.find(s => time >= s.start && time <= s.end);
      setActiveSubtitle(sub ? sub.text : null);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [metadata.subtitles]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    // In a real app, this would trigger a download of the processed video.
    // Here we simulate the successful edit completion.
    alert("Exporting Final Pro Video (Silent + Subtitled)... Check your downloads.");
  };

  const isVertical = metadata.originalFormat === 'vertical';

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left sidebar: Script & Stats */}
      <div className="w-80 border-r border-zinc-800/50 bg-zinc-900/30 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-zinc-800/50">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Editing Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/30">
              <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Languages</p>
              <div className="flex flex-wrap gap-1">
                {metadata.detectedLanguages.map(l => (
                  <span key={l} className="text-[9px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-sm font-bold uppercase">{l}</span>
                ))}
              </div>
            </div>
            <div className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/30">
              <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Dead Space</p>
              <p className="text-sm font-bold text-red-400">-{metadata.silenceCuts.length} segments</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Rewritten Darija Script</h3>
            <button className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400 hover:text-white transition-colors">COPY</button>
          </div>
          <div className="p-4 bg-zinc-800/20 border border-zinc-700/30 rounded-2xl">
            <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap font-medium">
              {metadata.rewrittenScript}
            </p>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Subtitle Breakdown</h3>
            <div className="space-y-3">
              {metadata.subtitles.map((sub, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    activeSubtitle === sub.text ? 'bg-blue-600/10 border-blue-500/50 scale-[1.02]' : 'bg-zinc-800/30 border-zinc-700/30 hover:bg-zinc-800/50'
                  }`}
                  onClick={() => {
                    if(videoRef.current) videoRef.current.currentTime = sub.start;
                  }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-bold text-zinc-500">{sub.start.toFixed(1)}s → {sub.end.toFixed(1)}s</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-snug">{sub.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 bg-black flex flex-col relative group">
        <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
          <div className={`relative shadow-2xl shadow-black rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 ${isVertical ? 'h-full aspect-[9/16]' : 'w-full aspect-video max-h-full'}`}>
            <video 
              ref={videoRef}
              src={video.previewUrl} 
              muted={true} // MUST be silent per rules
              className="w-full h-full object-cover"
              onClick={togglePlay}
            />
            
            {/* Overlay Subtitles (Visual simulation of burned-in subs) */}
            {activeSubtitle && (
              <div className="absolute inset-x-0 bottom-[15%] flex justify-center px-8 pointer-events-none">
                <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-2xl transform scale-110">
                  <p className="text-white text-center font-bold text-lg md:text-xl tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {activeSubtitle}
                  </p>
                </div>
              </div>
            )}

            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer" onClick={togglePlay}>
                <div className="w-16 h-16 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Controls */}
        <div className="p-6 bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-800/50 flex items-center gap-6">
          <button onClick={togglePlay} className="p-2 text-zinc-400 hover:text-white transition-colors">
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
            )}
          </button>
          
          <div className="flex-1 h-1 bg-zinc-800 rounded-full relative overflow-hidden group/seek cursor-pointer">
            <div 
              className="absolute h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]"
              style={{ width: `${(currentTime / (videoRef.current?.duration || 1)) * 100}%` }}
            />
          </div>

          <div className="text-[10px] font-bold font-mono text-zinc-500 tabular-nums">
            {currentTime.toFixed(2)} / {(videoRef.current?.duration || 0).toFixed(2)}
          </div>

          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Final
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorWorkspace;
