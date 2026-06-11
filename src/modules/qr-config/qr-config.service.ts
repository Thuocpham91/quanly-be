import { Injectable, NotFoundException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";
import { QrConfig } from "./qr-config.entity";
import { CreateQrConfigDto, UpdateQrConfigDto } from "./dto/qr-config.dto";

@Injectable()
export class QrConfigService {
  constructor(
    @InjectRepository(QrConfig)
    private readonly repo: Repository<QrConfig>,
  ) {}

  async getAll(): Promise<any> {
    const data = await this.repo.find({ order: { createdAt: "DESC" } });
    return { statusCode: HttpStatus.OK, data };
  }

  async getById(id: string): Promise<any> {
    const config = await this.repo.findOne({ where: { id } });
    if (!config) throw new NotFoundException(`QR Config with ID ${id} not found`);
    return { statusCode: HttpStatus.OK, data: config };
  }

  async create(dto: CreateQrConfigDto): Promise<any> {
    if (dto.isActive) {
      await this.repo.update({ isActive: true }, { isActive: false });
    }
    const config = this.repo.create(dto);
    const saved = await this.repo.save(config);
    return { statusCode: HttpStatus.CREATED, data: saved };
  }

  async update(id: string, dto: UpdateQrConfigDto): Promise<any> {
    const config = await this.repo.findOne({ where: { id } });
    if (!config) throw new NotFoundException(`QR Config with ID ${id} not found`);

    if (dto.isActive) {
      // Deactivate all others first
      await this.repo.update({ id: Not(id), isActive: true }, { isActive: false });
    }

    Object.assign(config, dto);
    const saved = await this.repo.save(config);
    return { statusCode: HttpStatus.OK, data: saved };
  }

  async delete(id: string): Promise<any> {
    const config = await this.repo.findOne({ where: { id } });
    if (!config) throw new NotFoundException(`QR Config with ID ${id} not found`);
    await this.repo.remove(config);
    return { statusCode: HttpStatus.OK, message: "Deleted successfully" };
  }
}
