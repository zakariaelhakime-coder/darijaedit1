
export interface Subtitle {
  start: number;
  end: number;
  text: string;
}

export interface EditMetadata {
  detectedLanguages: string[];
  originalFormat: 'vertical' | 'horizontal';
  rewrittenScript: string;
  subtitles: Subtitle[];
  silenceCuts: { start: number; end: number }[];
  pacingSummary: string;
}

export enum EditorStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  EDITING = 'EDITING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface VideoFile {
  file: File;
  previewUrl: string;
  aspectRatio: number;
}
