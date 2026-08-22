import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Check } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value?: string;
  onChange: (url: string | undefined) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, value, onChange }) => {
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local data URL for preview and mock storage
      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setIsUrlMode(false);
      setUrlInput('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300">{label}</label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-[11px] text-red-400 hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Remove
          </button>
        )}
      </div>

      {value ? (
        <div className="relative rounded-xl border border-defence-500/40 bg-navy-950 p-2 overflow-hidden group max-w-sm">
          <img src={value} alt="Uploaded preview" className="max-h-36 w-auto object-contain rounded-lg mx-auto" />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/80 text-white hover:bg-red-600 transition-colors shadow"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : isUrlMode ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Paste image URL (https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-defence-500"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="p-2 rounded-xl bg-defence-700 hover:bg-defence-600 text-white text-xs font-bold"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsUrlMode(false)}
            className="p-2 rounded-xl bg-navy-800 text-slate-400 hover:text-white text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-950 hover:bg-navy-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-defence-400" />
            <span>Upload Image</span>
          </button>
          <button
            type="button"
            onClick={() => setIsUrlMode(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-950 hover:bg-navy-800 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Paste URL</span>
          </button>
        </div>
      )}
    </div>
  );
};
