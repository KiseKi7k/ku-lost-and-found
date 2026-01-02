"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Input } from "./ui/input";

type DropzoneProps = {
  onChange: (file: File | null) => void;
  value?: File | null;
};

export default function ImageDropzone({ onChange, value }: DropzoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      onChange(file);
    },
    [onChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  useEffect(() => {
    if (!value) {
      setPreview(null);
      setFileName(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    setFileName(value.name);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`w-150 h-80 border-2 border-dashed rounded-lg flex items-center justify-center relative
        ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
      >
        <Input
          type="file"
          accept="image/*"
          hidden
          id="imageInput"
          className="w-full h-full"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />

        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover rounded-lg"
          />
        ) : (
          <label htmlFor="imageInput" className="cursor-pointer text-center">
            อัพโหลดรูปภาพ
          </label>
        )}
      </div>
      {preview && (
        <div className="flex gap-4 justify-center items-center">
          {fileName}
          <label
            htmlFor="imageInput"
            className="cursor-pointer text-center text-primary underline hover:text-primary/60 transition-all duration-150 ease-out"
          >
            อัพโหลดรูปภาพ
          </label>
        </div>
      )}
    </div>
  );
}
