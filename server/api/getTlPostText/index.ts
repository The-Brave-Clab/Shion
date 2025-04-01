import { z } from "zod";
import { join } from "pathe";
import { readFile } from "fs/promises";

import { dataPath } from "../items/[type]";
import { existsSync } from "fs";

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(
    event,
    z.object({
      id: z.string().regex(/^[^/\\]+$/),
    }).parse
  );

  const itemPath = join(dataPath, "tlPost", query.id, "text.txt");
  if (!existsSync(itemPath))
    throw createError({ statusCode: 404, message: "File not found" });

  try {
    const data = await readFile(itemPath, "utf8");
    return data;
  } catch {
    throw createError({ statusCode: 500, message: "Failed to read file" });
  }
});
