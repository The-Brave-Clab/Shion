import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "pathe";
import { z } from "zod";

import {
  archiveDataCache,
  dataPath,
  linkRelationships,
  securityRegex,
} from "~/server/utils";
import type { ArchiveItem } from "~/types";

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(
    event,
    z.object({
      type: z.string().regex(securityRegex),
      id: z.string().regex(securityRegex),
    }).parse
  );

  const itemPath = join(dataPath, query.type, query.id, "data.json");
  if (!existsSync(itemPath)) {
    throw createError({ statusCode: 404, message: "Item not found" });
  }

  try {
    const item: ArchiveItem = JSON.parse(await readFile(itemPath, "utf8"));

    if (item.relationships) {
      archiveDataCache.clear();

      item.relationships = await linkRelationships(item.relationships);
    }

    return item;
  } catch (error) {
    console.error("Error reading item:", error);
    throw createError({ statusCode: 500, message: "Failed to read item" });
  }
});
