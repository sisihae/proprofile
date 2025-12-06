export interface EditResponse {
  imageUrl?: string;
  text?: string;
  error?: string;
}

export interface PresetPrompt {
  id: string;
  label: string;
  prompt: string;
  icon: React.ReactNode;
}
