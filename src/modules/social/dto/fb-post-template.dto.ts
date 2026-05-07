import { IsString, IsArray, IsOptional } from "class-validator";

export class CreateFbPostTemplateDto {
  @IsString()
  content!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fileUrls?: string[];
}

export class UpdateFbPostTemplateDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fileUrls?: string[];
}
