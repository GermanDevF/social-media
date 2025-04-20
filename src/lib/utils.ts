import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate, formatDistanceToNowStrict } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, {
      addSuffix: true,
      locale: {
        formatDistance: (token, count) => {
          if (token === "xSeconds") {
            return `Hace ${count} ${count === 1 ? "segundo" : "segundos"}`;
          }
          if (token === "xMinutes") {
            return `Hace ${count} ${count === 1 ? "minuto" : "minutos"}`;
          }
          return `Hace ${count} ${count === 1 ? "hora" : "horas"}`;
        },
      },
    });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMM dd, yyyy");
    }
  }
}

export function formatNumber(num: number) {
  return Intl.NumberFormat("es-ES", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(num);
}
