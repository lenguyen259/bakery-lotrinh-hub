import { vi, type Dictionary } from "./vi";
import { en } from "./en";

export function getDictionary(locale: "vi" | "en"): Dictionary {
  return locale === "en" ? en : vi;
}

export { vi, en };
