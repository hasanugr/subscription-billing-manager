"use client";

import { useMeQuery, useLogoutMutation } from "@sbm/api-client";
import { useRouter } from "next/navigation";
import { defaultLocale } from "@/i18n/config";
import { getGeneralMessages } from "@/i18n/general";

export default function HomePage() {
  const router = useRouter();
  const { data, isLoading } = useMeQuery();

  const user = data ?? null;

  const [logout] = useLogoutMutation();

  const t = getGeneralMessages(defaultLocale);

  async function handleLogout() {
    try {
      await logout().unwrap();
      router.push("/login");
    } catch (err) {
      console.error("Logout error", err);
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">{t.title}</h1>

      {isLoading && <p>{t.meFetchLoading}</p>}

      {!isLoading && !user && (
        <p>
          {t.meFetchUnauthorized}{" "}
          <a href="/login" className="underline">
            {t.meFetchUnauthorizedButton}
          </a>
        </p>
      )}

      {!isLoading && user && (
        <div className="space-y-2">
          <p>
            {t.welcome}, <span className="font-medium">{user.email}</span>
          </p>
          <p>
            {t.role}: {user.role}
          </p>
          <p>
            {t.baseCurrency}: {user.baseCurrency}
          </p>
          <br />

          <button
            onClick={handleLogout}
            className="rounded bg-red-500 px-4 py-2 text-white cursor-pointer hover:bg-red-600"
          >
            {t.logoutButton}
          </button>

          <button
            onClick={() => router.push("/categories")}
            className="ml-2 rounded bg-blue-500 px-4 py-2 text-white cursor-pointer hover:bg-blue-600"
          >
            {t.categoriesButton}
          </button>
        </div>
      )}
    </main>
  );
}
