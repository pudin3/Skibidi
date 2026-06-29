export type FileType = "pptx" | "wrld";
export type PresentationStatus = "active" | "completed";

export interface Presentation {
  id: string;
  title: string;
  file_url: string;
  file_path: string;
  file_type: FileType;
  status: PresentationStatus;
  duration: number | null; // menit
  session_start: string | null; // ISO timestamp
  created_at: string;
}

export interface Question {
  id: string;
  presentation_id: string | null;
  nama: string;
  kelompok: string | null;
  pertanyaan: string;
  created_at: string;
}

export type MainTab = "materi" | "tanya" | "evaluasi";
