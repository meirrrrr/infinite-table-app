export interface RecordItem {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  // при необходимости можно добавить дополнительные поля: address, city, country и т.п.
}

export interface RecordsResponse {
  records: RecordItem[];
  totalCount: number | null;
}
