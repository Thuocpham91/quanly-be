import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf, MaxLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "admin", description: "Tên đăng nhập hoặc số điện thoại" })
  @IsString()
  @IsNotEmpty({ message: "Username không được để trống" })
  username!: string;

  @ApiProperty({ example: "123456", description: "Mật khẩu" })
  @IsString()
  @IsNotEmpty({ message: "Password không được để trống" })
  @MinLength(6, { message: "Password phải có ít nhất 6 ký tự" })
  password!: string;
}

export class RegisterDto {
  @ApiProperty({ example: "admin", description: "Tên đăng nhập" })
  @IsString()
  @IsNotEmpty({ message: "Username không được để trống" })
  username!: string;

  @ApiProperty({ example: "0123456789", description: "Số điện thoại" })
  @IsString()
  @IsNotEmpty({ message: "Số điện thoại không được để trống" })
  @MaxLength(20, { message: "Số điện thoại không được vượt quá 20 ký tự" })
  phone!: string;

  @ApiProperty({ example: "123456", description: "Mật khẩu" })
  @IsString()
  @IsNotEmpty({ message: "Password không được để trống" })
  @MinLength(6, { message: "Password phải có ít nhất 6 ký tự" })
  password!: string;

  @ApiProperty({ example: "user@example.com", description: "Email", required: false })
  @ValidateIf((obj, value) => (obj || true) && value !== undefined && value !== null && value !== "")
  @IsEmail({}, { message: "Email không hợp lệ" })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: "John Doe", description: "Họ và tên", required: false })
  @IsString()
  @IsOptional()
  fullName?: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: "user@example.com", description: "Email để nhận mật khẩu mới" })
  @IsEmail({}, { message: "Email không hợp lệ" })
  @IsNotEmpty({ message: "Email không được để trống" })
  email!: string;
}
