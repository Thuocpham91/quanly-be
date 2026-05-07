import { IsString, IsUrl, IsOptional } from "class-validator";

export class CreateFbGroupDto {
  @IsString()
  name!: string;

  @IsUrl()
  url!: string;

  @IsString()
  @IsOptional()
  type?: string;
}

export class UpdateFbGroupDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  type?: string;
}
