import { apiClient } from "./axios";
import { type RecordItem, type RecordsResponse } from "./types";
import { useUserIdStore } from "@/stores/useUserIdStore";
import PAGE_SIZE from "@/constants/page_size";

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
  console.log("fetchRecordsPage получил totalCount =", totalCount);

  useUserIdStore.getState().setLastId(totalCount);

  return {
    records,
    totalCount,
  };
}

export async function createRecord(payload: {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
}): Promise<RecordItem> {
  const response = await apiClient.post<RecordItem>("/records", payload);
  return response.data;
}
