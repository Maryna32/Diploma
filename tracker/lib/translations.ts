import { MediaType, StatusType } from "@/lib/generated/prisma";

export const mediaTypeOptions: { value: MediaType; label: string }[] = [
  { value: "BOOK", label: "Книга" },
  { value: "MOVIE", label: "Фільм" },
  { value: "SERIES", label: "Серіал" },
  { value: "COURSE", label: "Курс" },
  { value: "PODCAST", label: "Подкаст" },
  { value: "CUSTOM", label: "Інше" },
];

export const statusTypeOptions: { value: StatusType; label: string }[] = [
  { value: "TO_CONSUME", label: "Заплановано" },
  { value: "IN_PROGRESS", label: "В процесі" },
  { value: "COMPLETED", label: "Завершено" },
  { value: "DROPPED", label: "Покинуто" },
];
