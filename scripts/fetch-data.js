import path from "path";
import axios from "axios";
import { writeFileSync, existsSync, mkdirSync, unlinkSync } from "fs";
import AdmZip from "adm-zip";

const DATA_ZIP_URL =
  "https://github.com/The-Brave-Clab/Shion/releases/download/data-publish/data_minimal.zip";
const OUTPUT_DIR = path.resolve("public/data");
const ZIP_PATH = path.resolve("temp.zip");

async function downloadFile(url, dest) {
  const response = await axios({
    method: "GET",
    url: url,
    responseType: "arraybuffer",
  });

  writeFileSync(dest, response.data);
}

async function downloadAndExtract() {
  if (existsSync(path.join(OUTPUT_DIR, "tlPost"))) return;

  console.log("downloading data...");
  await downloadFile(DATA_ZIP_URL, ZIP_PATH);

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log("extracting data...");
  const zip = new AdmZip(ZIP_PATH);
  zip.extractAllTo(OUTPUT_DIR, true);

  console.log("done, cleaning up...");
  unlinkSync(ZIP_PATH);
}

downloadAndExtract().catch((err) => {
  console.error("failed to download or unzip: ", err);
  process.exit(1);
});
