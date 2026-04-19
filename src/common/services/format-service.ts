import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { File } from "fastify-multer/lib/interfaces";
import * as bcrypt from "bcrypt";
import { serverInternalError } from "@common/constans";

export const formatServices = {
  responseError: (message: string, statusCode: number = HttpStatus.BAD_REQUEST) => {
    return {
      error: true,
      message,
      statusCode,
    };
  },
  convertRole: async () => {
    return true;
  },
  comparePasswords: async (userPassword: string, currentPassword: string) => {
    return await bcrypt.compare(currentPassword, userPassword);
  },
};

export const imageFileFilter = (req: FastifyRequest, file: File, callback) => {
  console.log("🚀 ~ file: formatServices.ts:20 ~ imageFileFilter ~ req:", req);
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return callback(new Error("Only image files are allowed!"), false);
  }
  callback(null, true);
};

export const csvFileFilter = (req: FastifyRequest, file: File, callback) => {
  console.log("🚀 ~ file: formatServices.ts:20 ~ csvFileFilter ~ req:", req);
  if (!file.originalname.match(/\.(csv|jpg|jpeg|png|gif|webp)$/)) {
    return callback(new Error("Only CSV files are allowed!"), false);
  }
  callback(null, true);
};
