import { Controller, Post, Get, Delete, Param, Body, Req, Res, Query } from "@nestjs/common";
import { FastifyRequest, FastifyReply } from "fastify";
import { FileService } from "./file.service";
import { ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { AuthCustom } from "@core/decorators/auth-custom.decorator";
import { UploadFileListResponse, UploadFileResponse } from "./upload-file.response";

@ApiTags("File Management")
@Controller("files")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @AuthCustom()
  @Post("upload")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: { type: "string", format: "binary" },
        },
      },
    },
  })
  async uploadFile(@Req() req: FastifyRequest): Promise<UploadFileResponse> {
    return this.fileService.uploadSingleFile(req);
  }

  @AuthCustom()
  @Post("upload-multiple")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: { type: "string", format: "binary" },
        },
      },
    },
  })
  async uploadFiles(@Req() req: FastifyRequest): Promise<UploadFileListResponse> {
    return this.fileService.uploadMultipleFiles(req);
  }

  @AuthCustom()
  @Get(":fileName")
  async getFile(@Param("fileName") fileName: string, @Res() res: FastifyReply) {
    const { stream, meta } = await this.fileService.getFileStream(fileName);
    res.type(meta.mimeType || "application/octet-stream");
    res.header("Content-Disposition", `inline; filename="${encodeURIComponent(meta.fileName)}"`);
    return res.send(stream);
  }

  @AuthCustom()
  @Get("file/:key")
  async getFileInfo(@Param("key") key: string) {
    return await this.fileService.getFileInfo(key);
  }

  @AuthCustom()
  @Delete()
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        fileNames: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
  })
  async deleteFiles(@Body("fileNames") fileNames: string[]) {
    return this.fileService.deleteFiles(fileNames);
  }
}
