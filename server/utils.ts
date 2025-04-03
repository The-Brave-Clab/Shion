import { readFile } from "fs/promises";
import { join, resolve } from "pathe";
import { existsSync } from "fs";

import type { ArchiveItem, RelationshipData } from "~/types";

export const dataPath = resolve(process.cwd(), "public", "data");
export const archiveDataCache = new Map<string, ArchiveItem>();

export const securityRegex = /^(?!\.\.)[^/\\]+$/;

export async function linkRelationships(
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
