import { z } from "zod";
import { join } from "pathe";
import { readFile } from "fs/promises";

import { dataPath, securityRegex } from "~/server/utils";
import { existsSync } from "fs";

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(
    event,
    z.object({
      type: z.string().regex(securityRegex),
      id: z.string().regex(securityRegex),
      filename: z
        .string()
        .regex(securityRegex)
        .regex(/\.(json|html|txt)$/),
    }).parse
  );

  const itemPath = join(dataPath, query.type, query.id, query.filename);
  if (!existsSync(itemPath)) {
    throw createError({ statusCode: 404, message: "File not found" });
  }

  try {
    const data = await readFile(itemPath, "utf8");
    return data;
  } catch {
    throw createError({ statusCode: 500, message: "Failed to read file" });
  }
});
