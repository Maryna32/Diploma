"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LogForm from "../form/LogForm";

export default function EditLog() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    const fetchLog = async () => {
      const res = await fetch("/api/logs");
      const data = await res.json();
      const log = data.find((item: any) => String(item.id) === id);

      if (!log) {
        router.push("/my-log");
        return;
      }

      setInitialValues(log);
    };

    fetchLog();
  }, [id, router]);

  if (!initialValues) {
    return <p className="text-center pt-10 text-gray-500">Завантаження...</p>;
  }

  return (
    <LogForm
      initialValues={initialValues}
      submitText="Оновити"
      onSubmit={async ({ file, ...data }) => {
        let coverUrl = data.coverUrl;

        if (file) {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/upload/cover", {
            method: "POST",
            body: formData,
          });

          const upload = await res.json();
          coverUrl = upload.url;
        }

        const response = await fetch(`/api/logs/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, coverUrl }),
        });

        if (!response.ok) throw new Error();
          router.push(`/logs/${id}`);
          router.refresh();
      }}
    />
  );
}