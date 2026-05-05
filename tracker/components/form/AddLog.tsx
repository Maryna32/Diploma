"use client";

import { useRouter } from "next/navigation";
import LogForm from "./LogForm";

export default function AddLog() {
  const router = useRouter();

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload/cover", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    return data.url;
  };

  return (
    <LogForm
      submitText="Зберегти"
      onSubmit={async ({ file, ...data }) => {
        let coverUrl = data.coverUrl;

        if (file) {
          coverUrl = await uploadFile(file);
        }

        const response = await fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, coverUrl }),
        });

        if (!response.ok) throw new Error();
        router.push("/my-log");
      }}
    />
  );
}