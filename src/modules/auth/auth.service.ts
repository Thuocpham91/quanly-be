import {
  Injectable,
  UnauthorizedException,
  HttpStatus,
  Logger,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../user/user.entity";
import { Role } from "../role/role.entity";
import { LoginDto, RegisterDto, ForgotPasswordDto } from "./dto/auth.dto";
import { AuthResponse } from "./dto/auth.response";
import { SuccessCode } from "@common/constans/message-code.enum";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly jwtService: JwtService,
  ) { }

  /**
   * Xác thực user bằng username và password (dùng với LocalStrategy)
   */
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepo
      .createQueryBuilder("user")
      .addSelect(["user.password", "user.phone", "user.email", "user.username"])
      .leftJoinAndSelect("user.role", "role")
      .where("user.username = :username OR user.phone = :username OR user.email = :username", {
        username,
      })
      .getOne();

    if (user) {
      this.logger.debug(`Found user: id=${user.id}, username=${user.username}, phone=${user.phone}`);
    }

    if (!user) {
      this.logger.warn(`Đăng nhập thất bại: Không tìm thấy người dùng với identifier: ${username}`);
      return null;
    }

    if (!user.password) {
      this.logger.error(`Người dùng ${username} không có mật khẩu trong DB`);
      return null;
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      this.logger.warn(`Đăng nhập thất bại: Sai mật khẩu cho người dùng: ${username}`);
      return null;
    }

    this.logger.log(`Xác thực thành công người dùng: ${username}`);
    return user;
  }

  /**
   * Xử lý đăng nhập, trả về access token
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(dto.username, dto.password);

    if (!user) {
      throw new UnauthorizedException("Tên đăng nhập hoặc mật khẩu không đúng");
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`User ${user.username} đăng nhập thành công`);

    return {
      statusCode: HttpStatus.OK,
      message: SuccessCode.AUTH_SUCCESS,
      data: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        avatar: user.avatar,
        role: user.role,
        accessToken,
      },
    };
  }

  /**
   * Đăng ký tài khoản mới
   */
  async register(dto: RegisterDto): Promise<AuthResponse> {
    if (!dto.email) {
      // Tạo một email ảo duy nhất vì DB có constraint NOT NULL và UNIQUE
      dto.email = `no-email-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@localhost.local`;
    }

    const conditions: any[] = [{ username: dto.username }, { phone: dto.phone }];
    // Bây giờ chỉ chèn vào nếu email không phải là email ảo (tùy chọn tra cứu, nhưng ở đây cứ theo logic mới là ổn)
    if (dto.email && !dto.email.startsWith("no-email-")) {
      conditions.push({ email: dto.email });
    }

    const existingUser = await this.userRepo.findOne({
      where: conditions,
    });

    if (existingUser) {
      throw new BadRequestException("Tên đăng nhập, số điện thoại hoặc email đã tồn tại");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Mặc định role là khách hàng
    const customerRole = await this.roleRepo.findOne({
      where: [{ code: "USER" }],
    });

    const newUser = this.userRepo.create({
      ...dto,
      password: hashedPassword,
      roleId: customerRole ? customerRole.id : undefined,
    });

    const savedUser = await this.userRepo.save(newUser);
    this.logger.log(`User ${savedUser.username} đăng ký thành công`);

    const payload = {
      sub: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      statusCode: HttpStatus.CREATED,
      message: SuccessCode.SUCCESS,
      data: {
        id: savedUser.id,
        username: savedUser.username,
        fullName: savedUser.fullName,
        email: savedUser.email,
        phone: savedUser.phone,
        gender: savedUser.gender,
        avatar: savedUser.avatar,
        accessToken,
      },
    };
  }

  /**
   * Quên mật khẩu - tạo mật khẩu mới và (hiển thị tạm để test)
   */
  async forgotPassword(dto: ForgotPasswordDto): Promise<any> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user) {
      throw new NotFoundException("Không tìm thấy tài khoản với email này");
    }

    // Generate random 8 character password
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await this.userRepo.save(user);

    this.logger.log(`New password for user ${user.email} is: ${newPassword}. An email should be sent.`);

    return {
      statusCode: HttpStatus.OK,
      message: SuccessCode.SUCCESS,
      data: {
        message: "Mật khẩu mới đã được đặt lại (mô phỏng gửi qua email)",
        newPassword: newPassword, // FIXME: Xoá property này trên production khi có chức năng gửi email
      },
    };
  }
}
