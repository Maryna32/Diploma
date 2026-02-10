"use client";

import { useState } from "react";

type Props = {
  value?: number;
  onChange?: (value: number) => void;
};

export default function StarRating({ value = 0, onChange }: Props) {
  const [rating, setRating] = useState(value);

  const handleClick = (v: number) => {
    setRating(v);
    onChange?.(v);
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => handleClick(star)}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={`w-6 h-6 cursor-pointer transition-colors
            ${star <= rating ? "fill-yellow-400" : "fill-transparent stroke-yellow-400"}
          `}
        >
          <path
            strokeWidth="2"
            d="M12 17.27L18.18 21l-1.64-7.03
               L22 9.24l-7.19-.61L12 2
               9.19 8.63 2 9.24l5.46 4.73
               L5.82 21z"
          />
        </svg>
      ))}
    </div>
  );
}
