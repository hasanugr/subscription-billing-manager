"use client";

import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} from "@sbm/api-client";
import { useState } from "react";
import { defaultLocale } from "@/i18n/config";
import { getGeneralMessages } from "@/i18n/general";

export default function CategoriesPage() {
  const { data, isLoading, error } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();

  const [name, setName] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

  const t = getGeneralMessages(defaultLocale);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createCategory({ name, type }).unwrap();
      setName("");
    } catch (err) {
      console.error("createCategory error", err);
    }
  };

  if (isLoading) return <div className="p-4">{t.categoriesLoading}</div>;
  if (error) return <div className="p-4 text-red-500">{t.categoriesError}</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">{t.categoriesTitle}</h1>

      <form onSubmit={handleCreate} className="flex gap-2 items-center">
        <input
          type="text"
          placeholder={t.categoryName}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "INCOME" | "EXPENSE")}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="EXPENSE">{t.expense}</option>
          <option value="INCOME">{t.income}</option>
        </select>
        <button
          type="submit"
          disabled={isCreating}
          className="px-3 py-1 rounded bg-black text-white text-sm"
        >
          {isCreating ? t.categoryAddButtonLoading : t.categoryAddButton}
        </button>
      </form>

      <ul className="space-y-1 text-sm">
        {data?.map((c) => (
          <li key={c.id}>
            <span className="font-medium">{c.name}</span>{" "}
            <span className="text-xs text-gray-500">
              ({c.type === "EXPENSE" ? t.expense : t.income})
              {c.isGlobal ? " · global" : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
