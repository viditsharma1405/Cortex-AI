import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "../config/s3.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const uploadToS3=async (filename,buffer,contentType)=>{
  const hasAws = process.env.AWS_ACCESS_KEY_ID && 
                 !process.env.AWS_ACCESS_KEY_ID.includes("add") && 
                 process.env.AWS_BUCKET_NAME && 
                 !process.env.AWS_BUCKET_NAME.includes("add");

  if (!hasAws) {
    // Local fallback: save file directly to local uploads directory
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(uploadsDir, filename), buffer);
    console.log(`[Local Storage] Saved file locally: ${filename}`);
    return filename;
  }

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket:process.env.AWS_BUCKET_NAME,
        Body:buffer,
        Key:filename,
        ContentType:contentType
      })
    );
    return filename;
  } catch (err) {
    console.warn(`[AWS S3] Upload failed (${err.message}). Falling back to local storage.`);
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(uploadsDir, filename), buffer);
    return filename;
  }
}