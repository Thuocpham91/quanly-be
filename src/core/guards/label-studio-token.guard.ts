import { ConfigService } from "@nestjs/config";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
@Injectable()
export class LabelStudioTokenGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    return req.headers["authorization"].replace("Token ", "") === this.configService.get("LS_TOKEN");
  }
}
