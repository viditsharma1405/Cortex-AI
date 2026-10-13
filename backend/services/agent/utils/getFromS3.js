import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const getFromS3=async (filename,expiresIn=600)=>{
  const hasAws = process.env.AWS_ACCESS_KEY_ID && 
                 !process.env.AWS_ACCESS_KEY_ID.includes("add") && 
                 process.env.AWS_BUCKET_NAME && 
                 !process.env.AWS_BUCKET_NAME.includes("add");

  if (!hasAws) {
    const port = process.env.PORT || 8003;
    return `http://localhost:${port}/uploads/${filename}`;
  }

  try {
    return await getSignedUrl(
      s3,
      new GetObjectCommand({
          Bucket:process.env.AWS_BUCKET_NAME,
          Key:filename
      }),
      {expiresIn}
    );
  } catch (err) {
    console.warn(`[AWS S3] getSignedUrl failed (${err.message}). Using local URL fallback.`);
    const port = process.env.PORT || 8003;
    return `http://localhost:${port}/uploads/${filename}`;
  }
}