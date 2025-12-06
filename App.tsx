import React, { useState, useRef, useCallback } from 'react';
import { Upload, Wand2, Download, RefreshCw, Briefcase, User, Image as ImageIcon, X, ArrowRight, Zap, Eraser } from 'lucide-react';
import { editImageWithGemini } from './services/geminiService';
import { LoadingOverlay } from './components/LoadingOverlay';
import { Button } from './components/Button';
import { PresetPrompt } from './types';

const PRESETS: PresetPrompt[] = [
  {
    id: 'suit-navy',
    label: 'Navy Business Suit',
    prompt: 'Change the clothing to a high-quality, professional navy blue business suit with a crisp white shirt. Keep the lighting natural and preserve the facial features exactly.',
    icon: <Briefcase className="w-4 h-4" />
  },
  {
    id: 'blazer-black',
    label: 'Black Blazer',
    prompt: 'Change the outfit to a smart casual black blazer over a simple white t-shirt. Professional, modern look.',
    icon: <User className="w-4 h-4" />
  },
  {
    id: 'shirt-buttonup',
    label: 'Oxford Button-Up',
    prompt: 'Change the clothes to a light blue oxford button-down shirt. Clean, ironed, business casual style.',
    icon: <User className="w-4 h-4" />
  },
  {
    id: 'turtleneck',
    label: 'Sophisticated Turtleneck',
    prompt: 'Change the attire to a black sophisticated turtleneck sweater. Steve Jobs style, professional and creative.',
    icon: <User className="w-4 h-4" />
  }
];

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large. Please upload an image under 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImage(result);
        setMimeType(file.type);
        setGeneratedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleGenerate = async () => {
    if (!originalImage || !prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null); // Clear previous result while loading

    try {
      const result = await editImageWithGemini(originalImage, mimeType, prompt);
      setGeneratedImage(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate image. Please try again with a different prompt or image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'professional-profile-gemini.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
              ProProfile AI
            </h1>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center">
              <Zap className="w-3 h-3 mr-1 fill-current" />
              Gemini 2.5 Flash
             </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Welcome State */}
        {!originalImage && (
          <div className="max-w-3xl mx-auto text-center mt-12 mb-16 space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                Perfect your profile picture <br/>
                <span className="text-blue-600">in seconds.</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Change your outfit, fix the lighting, or remove distractions using advanced AI. 
                Upload your photo and type what you want to change.
              </p>
            </div>

            <div 
              onClick={triggerFileUpload}
              className="group relative flex flex-col items-center justify-center w-full max-w-xl mx-auto h-64 border-2 border-dashed border-slate-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer bg-white shadow-sm"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/png, image/jpeg, image/webp" 
                className="hidden" 
              />
              <div className="p-4 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-lg font-medium text-slate-700">Click to upload or drag and drop</p>
              <p className="text-sm text-slate-500 mt-2">PNG, JPG up to 5MB</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mt-12">
              {[
                { title: "Professional Attire", desc: "Swap casual tees for suits, blazers, or button-ups instantly." },
                { title: "Background Fix", desc: "Remove clutter or change to a clean studio background." },
                { title: "Lighting Check", desc: "Enhance lighting to look studio-quality." }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-4 text-indigo-600 font-bold">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editor Interface */}
        {originalImage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Sidebar Controls - Desktop */}
            <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
              {/* Image Actions */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Input Image</h3>
                  <button onClick={handleReset} className="text-sm text-red-500 hover:text-red-600 flex items-center">
                    <Eraser className="w-3 h-3 mr-1" /> Clear
                  </button>
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                  <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" onClick={triggerFileUpload} icon={<RefreshCw className="w-4 h-4"/>}>
                      Change Image
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/png, image/jpeg, image/webp" 
                      className="hidden" 
                    />
                  </div>
                </div>
              </div>

              {/* Prompt Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                   <Wand2 className="w-4 h-4 mr-2 text-purple-600" />
                   Magic Edit
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      What should we change?
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. Change the t-shirt to a navy blue suit..."
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none text-sm"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Quick Styles
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => setPrompt(preset.prompt)}
                          className={`text-left px-3 py-2 rounded-lg text-sm border transition-all flex items-center ${
                            prompt === preset.prompt 
                              ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' 
                              : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className={`p-1.5 rounded-md mr-3 ${prompt === preset.prompt ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                            {preset.icon}
                          </span>
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={handleGenerate} 
                    className="w-full" 
                    size="lg"
                    disabled={!prompt.trim() || isLoading}
                    variant={!prompt.trim() ? "outline" : "primary"}
                  >
                    {isLoading ? "Processing..." : "Generate Professional Look"}
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Result Area - Desktop */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-full min-h-[500px] flex flex-col">
                <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50 flex items-center justify-center p-8">
                  {/* Result Container */}
                  <div className="relative w-full max-w-2xl aspect-[4/5] sm:aspect-square bg-white shadow-2xl rounded-lg overflow-hidden border-4 border-white transition-all">
                    
                    {isLoading && <LoadingOverlay />}
                    
                    {generatedImage ? (
                      <img 
                        src={generatedImage} 
                        alt="Generated" 
                        className="w-full h-full object-cover animate-fade-in"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                        {originalImage && !isLoading ? (
                           <div className="text-center p-8 opacity-60">
                             <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                             <p className="text-lg font-medium">Ready to transform</p>
                             <p className="text-sm">Select a style on the left and hit Generate</p>
                           </div>
                        ) : null}
                      </div>
                    )}

                    {/* Compare Button Logic could go here, but overlapping might be tricky with aspect ratios. Keeping simple for now. */}
                  </div>
                </div>
                
                {/* Bottom Action Bar */}
                {generatedImage && (
                  <div className="bg-white border-t border-slate-100 p-4 flex justify-between items-center">
                    <p className="text-sm text-slate-500 hidden sm:block">
                      AI Generation complete.
                    </p>
                    <div className="flex space-x-3 ml-auto w-full sm:w-auto">
                      <Button variant="outline" onClick={() => setGeneratedImage(null)} className="flex-1 sm:flex-none">
                        Discard
                      </Button>
                      <Button variant="primary" onClick={handleDownload} icon={<Download className="w-4 h-4"/>} className="flex-1 sm:flex-none">
                        Download Image
                      </Button>
                    </div>
                  </div>
                )}
                
                {error && (
                   <div className="bg-red-50 text-red-600 p-4 border-t border-red-100 text-sm text-center">
                     {error}
                   </div>
                )}
              </div>
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
