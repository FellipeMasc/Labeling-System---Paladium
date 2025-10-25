import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export class S3Lib {
  private static instance: S3Lib;
  public client: S3Client;

  constructor() {
    this.client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
      region: process.env.AWS_REGION || "",
    });
  }

  public static getInstance() {
    if (!S3Lib.instance) {
      S3Lib.instance = new S3Lib();
    }
    return S3Lib.instance.client;
  }
}
