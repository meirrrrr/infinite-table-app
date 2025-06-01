import { apiClient } from "./axios";

import { type RecordItem, type RecordsResponse } from "./types";

const PAGE_SIZE = 20;
export async function fetchRecordsPage(page: number): Promise<RecordsResponse> {
  const response = await apiClient.get<any>("/records", {
    params: {
      _page: page,
      _per_page: PAGE_SIZE,
    },
  });

  const data = response.data;
  const totalCount = data.items;
  const records = data.data;

  return {
    records,
    totalCount,
  };
}

export async function createRecord(payload: {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
}): Promise<RecordItem> {
  const response = await apiClient.post<RecordItem>("/records", payload);
  return response.data;
}
