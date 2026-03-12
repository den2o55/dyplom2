import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encodeConfig(config: any): string {
  const str = JSON.stringify(config);
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  }));
}

export function decodeConfig(base64: string): any {
  const str = decodeURIComponent(Array.prototype.map.call(atob(base64), (c: any) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(str);
}
