"use client";

import { mediaTypeOptions, statusTypeOptions } from "@/lib/translations";
import StarRating from "../form/StarRating";
import { Button } from "@/components/ui/button";
import { Trash, Pencil } from "lucide-react";

interface LogCardProps {
  log: {
    id: string;
    title: string;
    mediaType: string;
    status: string;
    rating?: number | null;
    notes?: string | null;
    coverUrl?: string | null;
    createdAt: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function LogCard({ log, onEdit, onDelete }: LogCardProps){
  const mediaTypeLabel =
    mediaTypeOptions.find((opt) => opt.value === log.mediaType)?.label ||
    log.mediaType;
  const statusLabel =
    statusTypeOptions.find((opt) => opt.value === log.status)?.label ||
    log.status;

  return (
    <div className="border rounded-lg p-4 relative min-h-[9rem]">
      <div className="flex gap-4 items-stretch">
        {log.coverUrl ? (
          <div className="w-32 min-h-[10rem] flex-shrink-0 rounded-md overflow-hidden">
            <img
              src={log.coverUrl}
              alt={log.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-32 min-h-[10rem] flex-shrink-0 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-xs text-center px-2">
              Без обкладинки
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="font-semibold text-lg mb-1 truncate pr-20">{log.title}</h3>
          <div className="flex gap-2 mb-2 text-sm flex-wrap">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{mediaTypeLabel}</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">{statusLabel}</span>
          </div>
          {log.rating != null && log.rating > 0 ? (<div className="mb-2"><StarRating value={log.rating} readOnly /></div>) : 
          (<p className="text-xs text-gray-400 mt-1 mb-3">Не оцінено</p>)}
          <p className="text-xs text-gray-400">
            {new Date(log.createdAt).toLocaleDateString("uk-UA")}
          </p>
           {log.notes && (
          <p className="text-sm text-gray-600 line-clamp-2 overflow-hidden">
            {log.notes}
          </p>
            )}
          
        </div>

        <div className="absolute top-3 right-3 flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => onEdit(log.id)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(log.id)}>
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
