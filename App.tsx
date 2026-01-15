
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { EditorStatus, VideoFile, EditMetadata } from './types/editor';
import { analyzeVideoContent } from './services/gemini';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import ProcessingStatus from './components/ProcessingStatus';
import EditorWorkspace from './components/EditorWorkspace';

const App: React.FC = () => {
  const [status, setStatus] = useState<EditorStatus>(EditorStatus.IDLE);
  const [video, setVideo] = useState<VideoFile | null>(null);
  const [metadata, setMetadata] = useState<EditMetadata | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async (file: File) => {
    try {
      setErrorMessage(null);
      setStatus(EditorStatus.UPLOADING);
      
      const previewUrl = URL.createObjectURL(file);
      
      // Simple aspect ratio detection via video element
      const videoElement = document.createElement('video');
      videoElement.src = previewUrl;
      
      videoElement.onloadedmetadata = async () => {
        const ratio = videoElement.videoWidth / videoElement.videoHeight;
        setVideo({ file, previewUrl, aspectRatio: ratio });
        
        setStatus(EditorStatus.ANALYZING);
        
        const base64 = await fileToBase64(file);
        const result = await analyzeVideoContent(base64, file.type);
        
        setMetadata(result);
        setStatus(EditorStatus.EDITING);
        
        // Final "Baking" stage simulation
        setTimeout(() => {
          setStatus(EditorStatus.COMPLETED);
        }, 3000);
      };
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "An unexpected error occurred during processing.");
      setStatus(EditorStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(EditorStatus.IDLE);
    setVideo(null);
    setMetadata(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 overflow-hidden">
      <Header onReset={handleReset} />
      
      <main className="flex-1 flex flex-col relative">
        {status === EditorStatus.IDLE && (
          <div className="flex-1 flex items-center justify-center p-6">
            <UploadZone onUpload={handleUpload} />
          </div>
        )}

        {(status === EditorStatus.UPLOADING || status === EditorStatus.ANALYZING || status === EditorStatus.EDITING) && (
          <ProcessingStatus status={status} />
        )}

        {status === EditorStatus.COMPLETED && video && metadata && (
          <EditorWorkspace video={video} metadata={metadata} />
        )}

        {status === EditorStatus.ERROR && (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl max-w-md text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">Editor Error</h2>
              <p className="text-zinc-400 mb-6">{errorMessage}</p>
              <button 
                onClick={handleReset}
                className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="h-10 border-t border-zinc-800/50 flex items-center justify-between px-6 text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
        <span>© 2024 DarijaPro System</span>
        <div className="flex gap-4">
          <span>Neural Processing Active</span>
          <span>Latency: 142ms</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
