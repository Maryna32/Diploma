"use client";

import { mediaTypeOptions, statusTypeOptions } from "@/lib/translations";
import StarRating from "../form/StarRating";

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
}

export default function LogCard({ log }: LogCardProps) {
  const mediaTypeLabel =
    mediaTypeOptions.find((opt) => opt.value === log.mediaType)?.label ||
    log.mediaType;
  const statusLabel =
    statusTypeOptions.find((opt) => opt.value === log.status)?.label ||
    log.status;

  return (
    <div className="border rounded-lg p-4 ">
      <div className="flex gap-4">
        {log.coverUrl ? (
          <div className="w-32 h-32 flex-shrink-0 rounded-md overflow-hidden">
            <img
              src={log.coverUrl}
              alt={log.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-32 h-32 flex-shrink-0 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-xs text-center px-2">
              Без обкладинки
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 truncate">{log.title}</h3>

          <div className="flex gap-2 mb-2 text-sm flex-wrap">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {mediaTypeLabel}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              {statusLabel}
            </span>
          </div>

          {log.rating && (
            <div className="mb-2">
              <StarRating value={log.rating} readOnly />
            </div>
          )}

          {log.notes && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {log.notes}
            </p>
          )}

          <p className="text-xs text-gray-400">
            {new Date(log.createdAt).toLocaleDateString("uk-UA")}
          </p>
        </div>
      </div>
    </div>
  );
}
