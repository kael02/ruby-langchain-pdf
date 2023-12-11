import { ingestData } from "@/lib/ingest-data";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
const path = require("path");
type ProcessedFiles = Array<[string, File]>;

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("processing new pdf...");
  const form = await req.formData();

  console.log("form", form);

  const file: File = form.get("file");

  console.log("file ", file);

  const bucket = "images";

  if (!file) {
    return NextResponse.json({ message: "file empty" }, { status: 400 });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PRIVATE_KEY) {
    console.error("env file is invalid");
    return NextResponse.json(
      { message: "error" },
      {
        status: 400,
      },
    );
  }
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PRIVATE_KEY,
  );

  const fileBlob = await file.arrayBuffer();
  const fileBuffer = Buffer.from(fileBlob);

  // Uploading the document to supabase storage bucket
  await supabase.storage.from(bucket).upload(file.name, fileBuffer, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  });

  await ingestData(file);

  return NextResponse.json({ message: "success" }, { status: 200 });
}

// const saveFile = async (file: any) => {
//   const uploadDir = path.join(__dirname, "uploaded");
//   if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
//   }
//   const data = fs.readFileSync(file.path);
//   const newFilePath = `${uploadDir}/${file.name}`;
//   fs.writeFileSync(newFilePath, data);
//   await fs.unlinkSync(file.path);
//   console.log("start injesting data..");
//   await ingestData(newFilePath);
//   console.log("ingestion completed");
// };
