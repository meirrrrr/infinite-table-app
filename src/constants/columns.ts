export interface ColumnDef {
  key: keyof RecordItem;
  label: string;
  width?: string;
}

import type { RecordItem } from "../api/types";

// В этот массив можно добавить от 5 до 15 объектов.
// Сейчас приведён пример из 6, но вы спокойно можете убрать/добавить элементы (пока 5 ≤ length ≤ 15).
export const DEFAULT_COLUMNS: ColumnDef[] = [
  { key: "id", label: "ID", width: "w-1/12" },
  { key: "firstName", label: "Имя", width: "w-2/12" },
  { key: "lastName", label: "Фамилия", width: "w-2/12" },
  { key: "age", label: "Возраст", width: "w-1/12" },
  { key: "email", label: "Email", width: "w-3/12" },
  { key: "phone", label: "Телефон", width: "w-3/12" },
  { key: "address", label: "Адрес", width: "w-1/12" },
];

// Главное, чтобы длина была в диапазоне [5, 15].
