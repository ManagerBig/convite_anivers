"use client";

import { useEffect, useRef, useState } from 'react';

type Props = {
  initialUrl?: string | null;
  onFileSelected: (file: File | null, previewUrl: string | null) => void;
};

export function UploadImage({ initialUrl, onFileSelected }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);

  useEffect(() => {
    setPreview(initialUrl ?? null);
  }, [initialUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPreview(null);
      onFileSelected(null, null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelected(file, url);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-600">Foto do aniversariante</label>
      <div className="mt-2 flex items-center gap-4">
        <div className="h-24 w-24 overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
          {preview ? (
            <img src={preview} alt="Pré-visualização" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
              Prévia
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block text-sm text-slate-500"
          />
          {preview && (
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                if (inputRef.current) {
                  inputRef.current.value = '';
                }
                onFileSelected(null, null);
              }}
              className="text-xs font-semibold text-bigjump.red"
            >
              Remover
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
