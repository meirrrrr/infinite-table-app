export interface RecordItem {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
}

export interface RecordsResponse {
  records: RecordItem[];
  totalCount: number | null;
}
