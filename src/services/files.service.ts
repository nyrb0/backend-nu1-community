import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  private readonly sClient = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });
  constructor(private readonly configService: ConfigService) {}

  async upload(key: string, buffer: Buffer) {
    await this.sClient.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_BUCKET'),
        Key: key,
        Body: buffer,
      }),
    );
  }

  async delete(key: string) {
    await this.sClient.send(
      new DeleteObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_BUCKET'),
        Key: key,
      }),
    );
  }
}
