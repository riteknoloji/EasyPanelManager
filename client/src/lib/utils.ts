import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('tr-TR');
}

export function formatTime(time: string) {
  return time;
}

export function formatDateTime(date: string, time: string) {
  return `${formatDate(date)} - ${formatTime(time)}`;
}
