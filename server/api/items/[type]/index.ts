import { readdir, readFile } from "fs/promises";
import { join } from "pathe";
import { existsSync } from "fs";

import type { ArchiveItem } from "~/types";
import { archiveDataCache, dataPath, linkRelationships } from "~/server/utils";

const categories = ["tlPost", "article", "video", "information"];

function isValidType(type: string): boolean {
  return categories.includes(type);
}

function sortByDateTime(items: ArchiveItem[], timeKey: string) {
  items.sort((a, b) => {
    const aDate = a.attributes?.[timeKey]
      ? new Date(a.attributes[timeKey])
      : new Date(0);
    const bDate = b.attributes?.[timeKey]
      ? new Date(b.attributes[timeKey])
      : new Date(0);
    return bDate.getTime() - aDate.getTime();
  });
}

export default defineEventHandler(async (event) => {
  const type = event.context.params?.type as string;
  if (!isValidType(type)) {
    throw createError({ statusCode: 400, message: "Invalid item type" });
  }

  try {
    const dirPath = join(dataPath, type);
    const entries = await readdir(dirPath, { withFileTypes: true });
    const items: ArchiveItem[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const itemPath = join(dirPath, entry.name, "data.json");
      if (!existsSync(itemPath)) continue;

      try {
        const data = await readFile(itemPath, "utf8");
        const item: ArchiveItem = JSON.parse(data);

        if (item.relationships) {
          archiveDataCache.clear();

          item.relationships = await linkRelationships(item.relationships);
        }

        items.push(item);
      } catch (error) {
        console.error(`Error processing ${entry.name}:`, error);
      }
    }

    if (items.length > 0) {
      const firstItem = items[0];
      const timeKey = firstItem.attributes?.publishedAt
        ? "publishedAt"
        : firstItem.attributes?.publishDate
        ? "publishDate"
        : firstItem.attributes?.announcedDate
        ? "announcedDate"
        : null;

      if (timeKey) sortByDateTime(items, timeKey);
    }

    return items;
  } catch (error) {
    console.error("Server error:", error);
    throw createError({ statusCode: 500, message: "Internal server error" });
  }
});
