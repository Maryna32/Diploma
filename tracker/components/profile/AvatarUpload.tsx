"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AvatarUploadProps = {
  currentUrl: string | null;
  onUpload: (url: string) => void;
  initials: string;
};

export default function AvatarUpload({
  currentUrl,
  onUpload,
  initials,
}: AvatarUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    console.log("File received:", file.name, file.type, file.size);

    if (!file.type.startsWith("image/")) {
      alert("Будь ласка, оберіть зображення");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Файл повинен бути менше 2MB");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file...");

      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Помилка завантаження");
      }

      setPreviewUrl(data.url);
      onUpload(data.url);
      alert("Фото успішно завантажено!");
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Помилка завантаження файлу");
      setPreviewUrl(currentUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Drop event triggered");
    setIsDragging(false);

    const files = e.dataTransfer.files;
    console.log("Dropped files:", files);

    if (files && files.length > 0) {
      const file = files[0];
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("File selected from input:", file);
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={cn(
          "relative group cursor-pointer transition-transform",
          isDragging && "scale-105 ring-4 ring-primary ring-offset-2",
          isUploading && "cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
          <AvatarImage src={previewUrl || undefined} />
          <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
        </Avatar>

        <div
          className={cn(
            "absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
            isDragging && "opacity-100 bg-primary/60",
            isUploading && "opacity-100"
          )}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-white" />
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium">
          {isUploading ? "Завантаження..." : "Натисніть або перетягніть фото"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PNG, JPG, GIF до 2MB
        </p>
      </div>
    </div>
  );
}
