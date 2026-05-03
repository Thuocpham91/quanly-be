import { Injectable, NotFoundException, HttpStatus, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Milestone } from "./milestone.entity";
import { SuccessCode } from "@common/constans/message-code.enum";
import { CreateMilestoneDto, UpdateMilestoneDto } from "./dto/milestone.dto";

@Injectable()
export class MilestoneService {
  private readonly logger = new Logger(MilestoneService.name);

  constructor(
    @InjectRepository(Milestone)
    private readonly repo: Repository<Milestone>,
  ) {}

  async getAll(): Promise<any> {
    const data = await this.repo.find({ order: { targetAmount: 'ASC' } });
    return {
      statusCode: HttpStatus.OK,
      data,
      message: SuccessCode.SUCCESS,
    };
  }

  async getById(id: number): Promise<any> {
    const milestone = await this.repo.findOne({ where: { id: id + "" } });
    if (!milestone) throw new NotFoundException(`Milestone with ID ${id} not found`);

    return {
      statusCode: HttpStatus.OK,
      data: milestone,
      message: SuccessCode.SUCCESS,
    };
  }

  async create(dto: CreateMilestoneDto): Promise<any> {
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    return {
      statusCode: HttpStatus.CREATED,
      data: saved,
      message: SuccessCode.SUCCESS,
    };
  }

  async update(id: number, dto: UpdateMilestoneDto): Promise<any> {
    const milestone = await this.repo.findOne({ where: { id: id + "" } });
    if (!milestone) throw new NotFoundException(`Milestone with ID ${id} not found`);

    Object.assign(milestone, dto);
    const updated = await this.repo.save(milestone);

    return {
      statusCode: HttpStatus.OK,
      data: updated,
      message: SuccessCode.SUCCESS,
    };
  }

  async delete(id: number): Promise<any> {
    const milestone = await this.repo.findOne({ where: { id: id + "" } });
    if (!milestone) throw new NotFoundException(`Milestone with ID ${id} not found`);

    await this.repo.softRemove(milestone);
    
    return {
      statusCode: HttpStatus.OK,
      data: undefined,
      message: SuccessCode.SUCCESS,
    };
  }
}
