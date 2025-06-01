import React, { useState, useEffect, useRef, useCallback } from "react";
import { fetchRecordsPage } from "../api/records";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { type RecordItem } from "@/api/types";

const PAGE_SIZE = 20;

export const RecordsTable: React.FC = () => {
  const [recordsList, setRecordsList] = useState<RecordItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<boolean>(false);

  const loadPage = useCallback(
    async (pageNum: number) => {
      if (loadingRef.current) {
        return;
      }
      if (totalPages !== null && pageNum > totalPages) {
        return;
      }
      if (pageNum <= currentPage) {
        return;
      }

      loadingRef.current = true;
      setError(null);

      try {
        const { records, totalCount } = await fetchRecordsPage(pageNum);

        if (!Array.isArray(records)) {
          throw new Error("Неправильный формат: records не массив");
        }
        if (typeof totalCount === "number") {
          const pagesCount = Math.ceil(totalCount / PAGE_SIZE);
          setTotalPages(pagesCount);
          if (pageNum >= pagesCount) {
            setHasMore(false);
          }
        } else if (records.length < PAGE_SIZE) {
          setHasMore(false);
        }

        setRecordsList((prev) => [...prev, ...records]);
        setCurrentPage(pageNum);
      } catch (e) {
        const msg = (e as Error).message;
        setError(msg);
      } finally {
        loadingRef.current = false;
      }
    },
    [currentPage, totalPages]
  );

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  useEffect(() => {
    if (!loaderRef.current || loadingRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loadingRef.current && hasMore) {
          loadPage(currentPage + 1);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loaderRef.current);
    return () => {
      observer.disconnect();
    };
  }, [currentPage, hasMore, loadPage]);

  const formatPhone = (raw: string): string => {
    const digits = raw.replace(/\D/g, "");
    const local =
      digits.length === 11 && digits.startsWith("7") ? digits.slice(1) : digits;
    const part1 = local.slice(0, 3);
    const part2 = local.slice(3, 6);
    const part3 = local.slice(6, 8);
    const part4 = local.slice(8, 10);
    return `+7-${part1}-${part2}-${part3}-${part4}`;
  };

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Данные в таблице</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Имя
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Фамилия
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Возраст
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Телефон
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recordsList.map((rec) => (
              <tr key={rec.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-600">{rec.id}</td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {rec.firstName}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {rec.lastName}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{rec.age}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{rec.email}</td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {formatPhone(rec.phone)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div ref={loaderRef} className="h-1" />
        {error && (
          <div className="mt-4 text-center">
            <p className="text-red-500 mb-2">Ошибка: {error}</p>
            <Button onClick={() => loadPage(currentPage + 1)}>Повторить</Button>
          </div>
        )}
        {!hasMore && (
          <div className="mt-4 text-center text-gray-500">No more data</div>
        )}
        {loadingRef.current && hasMore && (
          <div className="mt-4 text-center text-gray-500">Загрузка...</div>
        )}
      </CardContent>
    </Card>
  );
};
