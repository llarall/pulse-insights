import type { TCourse } from "@/types/shared";
import { atom } from "jotai";

/**
 * Contains the course information from the xlsx sheet with the grouped responses
 */
export const courseAtom = atom<TCourse | null>(null);
