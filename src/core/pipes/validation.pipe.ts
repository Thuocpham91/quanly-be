import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CustomHttpException } from "@common/exceptions/custom-http.exception";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor() {}

  async transform(value: any, { metatype, type }: ArgumentMetadata) {
    if (value instanceof Object && this.isEmpty(value) && type !== "query") {
      throw new CustomHttpException("Not found body", "NOT_FOUND_BODY");
    }

    this.trimStrings(value);

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const translatedMessage = await this.formatErrors(errors);
      console.log("Error message: ", translatedMessage);
      console.log("Error message errors: ", errors);

      throw new BadRequestException(translatedMessage);
    }

    return object;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private async formatErrors(errors: any[]): Promise<string> {
    const messages: string[] = [];

    for (const err of errors) {
      for (const key in err.constraints) {
        const messageKey = err.constraints[key];

        messages.push(messageKey);
      }
    }

    return messages.join(", ");
  }

  private isEmpty(value: any): boolean {
    return Object.keys(value).length === 0;
  }

  private trimStrings(obj: any): void {
    if (typeof obj !== "object" || obj === null) return;

    for (const key in obj) {
      const val = obj[key];
      if (typeof val === "string") {
        obj[key] = val.trim();
      } else if (typeof val === "object") {
        this.trimStrings(val);
      }
    }
  }
}
