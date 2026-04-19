import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto, ForgotPasswordDto } from "./dto/auth.dto";
import { AuthResponse } from "./dto/auth.response";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   * API đăng nhập, trả về access token JWT
   */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Đăng nhập hệ thống" })
  @ApiResponse({
    status: 200,
    description: "Đăng nhập thành công, trả về access token",
    type: AuthResponse,
  })
  @ApiResponse({ status: 401, description: "Tên đăng nhập hoặc mật khẩu không đúng" })
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  /**
   * POST /auth/register
   * API đăng ký tài khoản mới
   */
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Đăng ký tài khoản" })
  @ApiResponse({
    status: 201,
    description: "Đăng ký thành công, trả về access token",
    type: AuthResponse,
  })
  @ApiResponse({ status: 400, description: "Tên đăng nhập hoặc email đã tồn tại" })
  async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  /**
   * POST /auth/forgot-password
   * API lấy lại mật khẩu
   */
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Quên mật khẩu / Lấy lại mật khẩu" })
  @ApiResponse({
    status: 200,
    description: "Mật khẩu mới đã được tạo",
  })
  @ApiResponse({ status: 404, description: "Không tìm thấy tài khoản với email này" })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<any> {
    return this.authService.forgotPassword(dto);
  }
}
