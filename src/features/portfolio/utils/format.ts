export const formatCurrency = (value: number, toFixed = 2): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: toFixed,
  }).format(value);

export const formatShortDate = (iso: string): string =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(iso));
