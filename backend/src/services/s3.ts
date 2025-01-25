import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION as string, 
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
     }
});

export async function uploadToS3(
    courseId: string,
    moduleId: string,
    lessonId: string,
    fileExtension: string
): Promise<{uploadUrl: string, key: string}> {
   const key = `courses/${courseId}/modules/${moduleId}/lessons/${lessonId}.${fileExtension}`;
   
   const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    
    Key: key,
    ContentType: `video/${fileExtension}`, 
   });

   const uploadUrl = await getSignedUrl(s3Client, command, {expiresIn: 600});

   return { uploadUrl, key };
}


export async function getSignedVideoUrl(key: string) {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {expiresIn: 3600});
    return signedUrl;
}

export async function deleteVideo(key: string) {
    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: key
    })
}