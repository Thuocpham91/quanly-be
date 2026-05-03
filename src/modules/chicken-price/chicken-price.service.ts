import { Injectable, NotFoundException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChickenPrice } from "./chicken-price.entity";
import { CreateChickenPriceDto, UpdateChickenPriceDto } from "./dto/chicken-price.dto";

@Injectable()
export class ChickenPriceService {
  constructor(
    @InjectRepository(ChickenPrice)
    private readonly repo: Repository<ChickenPrice>,
  ) {}

  async getAll(): Promise<any> {
    const data = await this.repo.find({ order: { priceDate: "DESC" } });
    return { statusCode: HttpStatus.OK, data };
  }

  async getToday(): Promise<any> {
    const today = new Date().toISOString().split("T")[0];
    const price = await this.repo.findOne({ where: { priceDate: today as any } });
    if (!price) {
      // Lấy bản ghi mới nhất nếu hôm nay chưa có
      const latest = await this.repo.findOne({ order: { priceDate: "DESC" } });
      return { statusCode: HttpStatus.OK, data: latest || null, isLatest: !latest };
    }
    return { statusCode: HttpStatus.OK, data: price };
  }

  async create(dto: CreateChickenPriceDto): Promise<any> {
    const entity = this.repo.create({ ...dto, priceDate: new Date(dto.priceDate) });
    const saved = await this.repo.save(entity);
    return { statusCode: HttpStatus.CREATED, data: saved };
  }

  async update(id: number, dto: UpdateChickenPriceDto): Promise<any> {
    const entity = await this.repo.findOne({ where: { id: id + "" } });
    if (!entity) throw new NotFoundException(`ChickenPrice with ID ${id} not found`);
    if (dto.priceDate) entity.priceDate = new Date(dto.priceDate);
    if (dto.pricePerKg !== undefined) entity.pricePerKg = dto.pricePerKg;
    if (dto.pricePerHead !== undefined) entity.pricePerHead = dto.pricePerHead;
    if (dto.note !== undefined) entity.note = dto.note;
    const saved = await this.repo.save(entity);
    return { statusCode: HttpStatus.OK, data: saved };
  }

  async delete(id: number): Promise<any> {
    const entity = await this.repo.findOne({ where: { id: id + "" } });
    if (!entity) throw new NotFoundException(`ChickenPrice with ID ${id} not found`);
    await this.repo.softRemove(entity);
    return { statusCode: HttpStatus.OK, message: "Deleted successfully" };
  }
}
