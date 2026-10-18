'use client';

import React, { useRef, useState, useEffect } from 'react';
import { X, Check, Trash2, PenTool, Type, Upload } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('');
  const [typedFont, setTypedFont] = useState('font-serif italic');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (canvas && hasDrawn) {
        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl);
        onClose();
      }
    } else if (activeTab === 'type') {
      if (!typedName.trim()) return;
      // Convert typed signature to canvas data URL
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.font = 'italic 36px Georgia, serif';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedName, 20, 60);
        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl);
        onClose();
      }
    } else if (activeTab === 'upload') {
      if (uploadedUrl) {
        onSave(uploadedUrl);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
              Add Digital Signature
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800 px-5 gap-4 bg-slate-50/50 dark:bg-zinc-900/50 shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('draw')}
            className={`py-2.5 font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'draw'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Draw</span>
          </button>
          <button
            onClick={() => setActiveTab('type')}
            className={`py-2.5 font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'type'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Type Name</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2.5 font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 space-y-4">
          {activeTab === 'draw' && (
            <div>
              <div className="border border-slate-300 dark:border-zinc-700 rounded-xl overflow-hidden bg-white relative touch-none">
                <canvas
                  ref={canvasRef}
                  width={440}
                  height={160}
                  className="w-full h-40 cursor-crosshair bg-white"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 text-xs italic">
                    Draw your signature here with mouse or stylus
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[11px] text-slate-400">
                  Draw above the line
                </span>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'type' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 block mb-1">
                  Your Full Legal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. David K. Mwangi"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-zinc-100"
                />
              </div>

              {typedName && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 flex items-center justify-center min-h-[90px]">
                  <span className="font-serif italic text-2xl text-slate-900 dark:text-white">
                    {typedName}
                  </span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-3">
              {uploadedUrl ? (
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700">
                  <img
                    src={uploadedUrl}
                    alt="Uploaded signature"
                    className="h-12 w-auto max-w-[160px] object-contain rounded bg-white p-1"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Signature Loaded</p>
                    <p className="text-[11px] text-slate-400">Ready to place on document</p>
                  </div>
                  <button
                    onClick={() => setUploadedUrl(null)}
                    className="text-red-500 hover:text-red-700 p-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white dark:bg-zinc-900 group">
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-2" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Upload Signature Image
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">PNG with transparent background recommended</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Signature</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
