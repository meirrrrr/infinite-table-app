import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createRecord } from "@/api/records";
import { useUserIdStore } from "@/stores/useUserIdStore";
import type { RecordItem } from "@/api/types";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DEFAULT_COLUMNS } from "@/constants/columns";

export const CreateRecordPage: React.FC = () => {
  const navigate = useNavigate();

  const initialFormData = DEFAULT_COLUMNS.reduce((acc, col) => {
    if (col.key === "id") return acc;
    acc[col.key] = "";
    return acc;
  }, {} as Record<keyof Omit<RecordItem, "id">, string>);

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastId = useUserIdStore((s) => s.lastId);
  const getNextId = useUserIdStore((s) => s.getNextId);

  const handleChange = (key: keyof Omit<RecordItem, "id">, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    for (const col of DEFAULT_COLUMNS) {
      if (col.key === "id") continue;
      const val = formData[col.key];
      if (!val || val.trim() === "") {
        setError(`Поле "${col.label}" обязательно.`);
        return;
      }
      if (
        (col.key === "firstName" || col.key === "lastName") &&
        val.trim().length < 2
      ) {
        setError(`В поле "${col.label}" должно быть минимум 2 символа.`);
        return;
      }
      if (col.key === "age") {
        const ageNum = Number(val);
        if (Number.isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
          setError("Age should be between 1 and 120");
          return;
        }
      }
      if (col.key === "email") {
        if (!/\S+@\S+\.\S+/.test(val.trim())) {
          setError("Invalid format for email");
          return;
        }
      }
      if (col.key === "phone") {
        const digitsOnly = val.replace(/\D/g, "");
        if (digitsOnly.length !== 10) {
          setError("Phone number should contain 11 digits");
          return;
        }
        if (!digitsOnly.startsWith("7")) {
          setError("Phone number should start with 7");
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const newId = getNextId();

      const payload: Partial<RecordItem> = { id: newId };
      for (const col of DEFAULT_COLUMNS) {
        if (col.key === "id") continue;
        const raw = formData[col.key];
        switch (col.key) {
          case "age":
            payload.age = Number(raw);
            break;
          case "phone":
            payload.phone = raw.replace(/\D/g, "");
            break;
          default:
            payload[col.key] = raw;
        }
      }

      await createRecord(payload as RecordItem);
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Create New Record</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="id" className="text-sm font-medium text-gray-700">
                {DEFAULT_COLUMNS.find((c) => c.key === "id")?.label || "ID"}
              </Label>
              <Input
                id="id"
                type="number"
                value={lastId + 1}
                disabled
                className="mt-1 bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Динамический рендер полей */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEFAULT_COLUMNS.map((col) => {
                if (col.key === "id") return null;

                const isFullWidth = col.key === "address";

                return (
                  <div
                    key={col.key}
                    className={isFullWidth ? "md:col-span-2" : ""}
                  >
                    <Label
                      htmlFor={col.key}
                      className="text-sm font-medium text-gray-700"
                    >
                      {col.label}
                    </Label>
                    <Input
                      id={col.key}
                      type={
                        col.key === "age"
                          ? "number"
                          : col.key === "email"
                          ? "email"
                          : col.key === "phone"
                          ? "tel"
                          : "text"
                      }
                      value={
                        formData[col.key as keyof typeof formData] as string
                      }
                      placeholder={`Enter ${col.label.toLowerCase()}`}
                      onChange={(e) =>
                        handleChange(
                          col.key as keyof Omit<RecordItem, "id">,
                          e.target.value
                        )
                      }
                      disabled={isSubmitting}
                      className="mt-1 w-full"
                    />
                  </div>
                );
              })}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Add Record"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
