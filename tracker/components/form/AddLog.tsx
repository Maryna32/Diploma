"use client";
import { mediaTypeOptions, statusTypeOptions } from "@/lib/translations";
import { MediaType, StatusType } from "@/lib/generated/prisma";

import StarRating from "./StarRating";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

function AddLog() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType | undefined>();
  const [status, setStatus] = useState<StatusType | undefined>();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !mediaType || !status) {
      alert("Заповніть обов'язкові поля");
      return;
    }

    try {
      setLoading(true);

      let coverUrl: string | undefined;
      if (file) {
        coverUrl = await uploadFile(file);
      }

      const response = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          mediaType,
          status,
          rating,
          notes,
          isPublic,
          coverUrl,
        }),
      });

      if (!response.ok) throw new Error("Помилка");

      router.push("/my-log");
    } catch (error) {
      alert("Не вдалося зберегти");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload/cover", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");

    return data.url;
  };

  return (
    <div className="min-h-screen flex justify-center pt-8 pb-24">
      <div className="border grid grid-cols-1 gap-5 p-6 rounded-lg w-full max-w-md">
        <div>
          <Label>Введіть назву</Label>
          <Input
            autoFocus
            type="text"
            placeholder="Назва"
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Введіть тип</Label>
          <Select
            value={mediaType}
            onValueChange={(value) => setMediaType(value as MediaType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Тип" />
            </SelectTrigger>

            <SelectContent>
              {mediaTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Введіть статус</Label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as StatusType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Статус" />
            </SelectTrigger>

            <SelectContent>
              {statusTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Обкладинка</Label>

          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;

              setFile(f);
              setPreview(URL.createObjectURL(f));
            }}
          />

          {preview && (
            <div className="mt-3 relative w-32">
              <img
                src={preview}
                className="w-32 h-48 object-cover rounded-md"
              />

              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview(null);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="absolute -top-2 -right-2 bg-black/70 text-white
                   rounded-full w-6 h-6 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        <div>
          <Label>Оцінка</Label>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div>
          <Label>Примітка</Label>
          <Textarea
            maxLength={500}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="public"
            checked={isPublic}
            onCheckedChange={(v) => setIsPublic(!!v)}
          />
          <Label htmlFor="public">Чи публічний запис?</Label>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => router.push("/my-log")}>
            Назад
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Збереження..." : "Зберегти"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddLog;
