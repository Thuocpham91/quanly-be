import { Injectable } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { v4 as uuidv4 } from "uuid";

import { UploadFileResponseDto } from "./upload-file.response.dto";
import { UploadFileResponse, UploadFileListResponse } from "./upload-file.response";
import { CustomHttpException } from "@common/exceptions/custom-http.exception";
import { ErrorCode, SuccessCode } from "@common/constans/message-code.enum";
import { AzureBlobStorageService } from "@core/services/azureBlobStorageService";
import { PassThrough, Readable } from "stream";
import { url } from "inspector";

@Injectable()
export class FileService {
  constructor(private readonly storageService: AzureBlobStorageService) {}

  private readonly CONFIG = {
    MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB (enforced by Fastify limit)
    MAX_FILE_NAME_LENGTH: 255,
    MAX_FILES_COUNT: 50,

    ALLOWED_EXTENSIONS: ["jpg", "jpeg", "png", "gif", "pdf", "csv"],
    BLACKLIST_EXTENSIONS: ["exe", "js", "sh", "bat", "cmd"],

    ALLOWED_MIME_TYPES: ["image/jpeg", "image/png", "image/gif", "application/pdf", "text/csv"],
    BLACKLIST_MIME_TYPES: ["application/x-msdownload", "application/javascript", "application/x-sh"],
  };

  /* ================= UPLOAD ================= */

  async uploadSingleFile(req: FastifyRequest): Promise<UploadFileResponse> {
    const file = await this.extractFirstFile(req);

    if (!file) {
      throw new CustomHttpException("No file uploaded", ErrorCode.NO_FILES_UPLOADED);
    }

    const data = await this.uploadStream(file.file, file.filename, file.mimetype);

    return { message: SuccessCode.SUCCESS, data };
  }

  async uploadMultipleFiles(req: FastifyRequest): Promise<UploadFileListResponse> {
    const parts = req.parts();
    const uploadedFiles: UploadFileResponseDto[] = [];
    let count = 0;

    for await (const part of parts) {
      if (part.type !== "file") continue;

      this.validateFileCount(++count);

      uploadedFiles.push(await this.uploadStream(part.file, part.filename, part.mimetype));
    }

    if (!uploadedFiles.length) {
      throw new CustomHttpException("No files uploaded", ErrorCode.NO_FILES_UPLOADED);
    }

    return { message: SuccessCode.SUCCESS, data: uploadedFiles };
  }

  /* ================= DOWNLOAD ================= */

  async getFileStream(key: string) {
    const stream = await this.storageService.getObjectStream(key);
    const info = await this.storageService.getBlobInfo(key);

    return {
      stream,
      meta: {
        fileName: key,
        mimeType: info.contentType,
        size: info.size,
      },
    };
  }

  async getFileInfo(key: string) {
    const info = await this.storageService.getBlobInfo(key);

    const url = await this.storageService.getPublicUrl(key);

    console.log("Generated signed URL:", {
      key,
      size: info.size,
      contentType: info.contentType,
      etag: info.etag,
      lastModified: info.lastModified,
      metadata: info.metadata,
      url: url,
    });

    return {
      key,
      size: info.size,
      contentType: info.contentType,
      etag: info.etag,
      lastModified: info.lastModified,
      metadata: info.metadata,
      url: url,
    };
  }

  async deleteFiles(keys: string[]): Promise<void> {
    await this.storageService.deleteObjects(keys);
  }

  /* ================= INTERNAL ================= */

  private async uploadStream(
    stream: NodeJS.ReadableStream | ReadableStream,
    fileName: string,
    contentType = "application/octet-stream",
  ): Promise<UploadFileResponseDto> {
    this.validateFileNameAndType(fileName, contentType);

    const uniqueName = this.generateUniqueFileName(fileName);

    const nodeStream = stream instanceof Readable ? stream : Readable.fromWeb(stream as any);

    // ✅ ĐẾM SIZE
    let size = 0;
    const counter = new PassThrough();
    counter.on("data", (chunk) => (size += chunk.length));
    nodeStream.pipe(counter);

    const { etag } = await this.storageService.uploadStream(uniqueName, counter, contentType);

    // 🔥 TẠO URL XEM ĐƯỢC
    const url = await this.storageService.getPublicUrl(uniqueName);

    return {
      key: uniqueName,
      etag,
      contentType,
      size,
      url, // ✅ APP DÙNG URL NÀY XEM FILE
    };
  }

  private async extractFirstFile(req: FastifyRequest) {
    const parts = req.parts();
    for await (const part of parts) {
      if (part.type === "file") return part;
    }
    return null;
  }

  private generateUniqueFileName(fileName: string): string {
    const ext = fileName.split(".").pop();
    const name = fileName.replace(`.${ext}`, "");

    return `${name}_${Date.now()}_${uuidv4()}.${ext}`;
  }

  private validateFileCount(count: number) {
    if (count > this.CONFIG.MAX_FILES_COUNT) {
      throw new CustomHttpException(
        `You can only upload up to ${this.CONFIG.MAX_FILES_COUNT} files`,
        ErrorCode.UPLOAD_FAILED,
      );
    }
  }

  private validateFileNameAndType(fileName: string, contentType: string) {
    const { MAX_FILE_NAME_LENGTH, ALLOWED_EXTENSIONS, BLACKLIST_EXTENSIONS, ALLOWED_MIME_TYPES, BLACKLIST_MIME_TYPES } =
      this.CONFIG;

    if (!fileName || fileName.length > MAX_FILE_NAME_LENGTH) {
      throw new CustomHttpException("Invalid file name", ErrorCode.UPLOAD_FAILED);
    }

    const ext = fileName.split(".").pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext) || BLACKLIST_EXTENSIONS.includes(ext)) {
      throw new CustomHttpException("Invalid extension", ErrorCode.UPLOAD_FAILED);
    }

    if (!ALLOWED_MIME_TYPES.includes(contentType) || BLACKLIST_MIME_TYPES.includes(contentType)) {
      throw new CustomHttpException("Invalid mime type", ErrorCode.UPLOAD_FAILED);
    }
  }
}
