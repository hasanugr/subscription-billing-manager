import type { Locale } from "./config";

export const expensesMessages: Record<
  Locale,
  {
    title: string;
    newExpenseTitle: string;
    listTitle: string;
    emptyState: string;
    loading: string;
    error: string;
    createError: string;
    deleteConfirm: string;
    fields: {
      category: string;
      amount: string;
      currency: string;
      date: string;
      note: string;
      recurrence: string;
      isSubscription: string;
    };
    validation: {
      categoryRequired: string;
      amountRequired: string;
      dateRequired: string;
    };
    buttons: {
      save: string;
      saving: string;
      delete: string;
    };
    recurrenceLabels: {
      NONE: string;
      WEEKLY: string;
      MONTHLY: string;
      YEARLY: string;
    };
    table: {
      date: string;
      category: string;
      amount: string;
      type: string;
      note: string;
      actions: string;
      typeSingle: string;
      typeSubscription: string;
    };
    currencyOptions: {
      TRY: string;
      USD: string;
      EUR: string;
      GBP: string;
    };
  }
> = {
  tr: {
    title: "Giderler",
    newExpenseTitle: "Yeni Gider Ekle",
    listTitle: "Son Giderler",

    emptyState: "Henüz kayıtlı gider yok.",
    loading: "Giderler yükleniyor...",
    error: "Giderler yüklenirken bir hata oluştu.",
    createError: "Gider oluşturulurken bir hata oluştu.",
    deleteConfirm: "Bu gideri silmek istediğine emin misin?",

    fields: {
      category: "Kategori",
      amount: "Tutar",
      currency: "Para Birimi",
      date: "Tarih",
      note: "Not",
      recurrence: "Tekrar",
      isSubscription: "Abonelik (Netflix, Spotify vb.)",
    },

    validation: {
      categoryRequired: "Lütfen bir kategori seç.",
      amountRequired: "Tutar 0'dan büyük olmalı.",
      dateRequired: "Lütfen bir tarih seç.",
    },

    buttons: {
      save: "Gideri Kaydet",
      saving: "Kaydediliyor...",
      delete: "Sil",
    },

    recurrenceLabels: {
      NONE: "Yok",
      WEEKLY: "Haftalık",
      MONTHLY: "Aylık",
      YEARLY: "Yıllık",
    },

    table: {
      date: "Tarih",
      category: "Kategori",
      amount: "Tutar",
      type: "Tür",
      note: "Not",
      actions: "İşlemler",
      typeSingle: "Tekil",
      typeSubscription: "Abonelik",
    },

    currencyOptions: {
      TRY: "TRY",
      USD: "USD",
      EUR: "EUR",
      GBP: "GBP",
    },
  },
  en: {
    title: "Expenses",
    newExpenseTitle: "Add New Expense",
    listTitle: "Recent Expenses",
    emptyState: "No expenses yet.",
    loading: "Loading expenses...",
    error: "An error occurred while loading expenses.",
    createError: "An error occurred while creating the expense.",
    deleteConfirm: "Are you sure you want to delete this expense?",
    fields: {
      category: "Category",
      amount: "Amount",
      currency: "Currency",
      date: "Date",
      note: "Note",
      recurrence: "Recurrence",
      isSubscription: "Subscription (Netflix, Spotify etc.)",
    },
    validation: {
      categoryRequired: "Please select a category.",
      amountRequired: "Amount must be greater than 0.",
      dateRequired: "Please select a date.",
    },
    buttons: {
      save: "Save Expense",
      saving: "Saving...",
      delete: "Delete",
    },
    recurrenceLabels: {
      NONE: "None",
      WEEKLY: "Weekly",
      MONTHLY: "Monthly",
      YEARLY: "Yearly",
    },
    table: {
      date: "Date",
      category: "Category",
      amount: "Amount",
      type: "Type",
      note: "Note",
      actions: "Actions",
      typeSingle: "One-time",
      typeSubscription: "Subscription",
    },
    currencyOptions: {
      TRY: "TRY",
      USD: "USD",
      EUR: "EUR",
      GBP: "GBP",
    },
  },
};

export function getExpensesMessages(locale: Locale) {
  return expensesMessages[locale];
}
