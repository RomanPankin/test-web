import type { TextOf } from "./types";

import { loadContent } from "./loadContent";
import { imageOf, imagesOf, textOf } from "./textOf";

/** `t(key, vars)` for a server component — the request's content, read once. */
export async function getText(): Promise<TextOf> {
  return textOf(await loadContent());
}

/** The images under a key, for a server component. */
export async function getImages(key: string): Promise<string[]> {
  return imagesOf(await loadContent(), key);
}

/** One image by key, for a server component. */
export async function getImage(key: string): Promise<string> {
  return imageOf(await loadContent(), key);
}
