import { readdir, readFile } from "fs/promises";
import { join, resolve } from "pathe";
import { existsSync } from "fs";
import type { ArchiveItem, RelationshipData } from "~/types";

const categories = ["tlPost", "article", "video", "information"];
export const dataPath = resolve(process.cwd(), "public", "data");
const archiveDataCache = new Map<string, ArchiveItem>();

function isValidType(type: string): boolean {
  return categories.includes(type);
}

async function linkRelationships(
  relationships: ArchiveItem["relationships"]
): Promise<ArchiveItem["relationships"]> {
  if (!relationships) return undefined;

  const results: Record<string, RelationshipData> = {};

  for (const [key, rel] of Object.entries(relationships).filter(
    ([_, rel]) => rel
  )) {
    const result: RelationshipData = { data: null };

    if (rel?.data) {
      const processData = async (item: ArchiveItem) => {
        const cached = archiveDataCache.get(item.id);
        if (cached) return cached;

        const itemPath = join(dataPath, item.type, item.id, "data.json");
        if (!existsSync(itemPath)) return null;

        try {
          const data = await readFile(itemPath, "utf8");
          const parsed: ArchiveItem = JSON.parse(data);
          archiveDataCache.set(parsed.id, parsed);

          if (parsed.relationships) {
            parsed.relationships = await linkRelationships(
              parsed.relationships
            );
          }
          return parsed;
        } catch (error) {
          console.error("Error processing relationship:", error);
          return null;
        }
      };

      if (Array.isArray(rel!.data)) {
        result.data = (await Promise.all(rel!.data.map(processData))).filter(
          (item) => item !== null
        );
      } else {
        result.data = await processData(rel!.data);
      }
    }

    results[key] = result;
  }

  return results;
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

  archiveDataCache.clear();

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
