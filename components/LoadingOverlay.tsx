import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl transition-all duration-300">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
        <Sparkles className="w-12 h-12 text-blue-600 animate-bounce mb-4 relative z-10" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Refining your look...</h3>
      <p className="text-gray-500 text-sm max-w-xs text-center">
        Gemini is analyzing the image and applying your professional style.
      </p>
      <Loader2 className="w-6 h-6 text-blue-500 animate-spin mt-6" />
    </div>
  );
};
