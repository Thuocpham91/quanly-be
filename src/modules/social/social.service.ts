import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FbGroupEntity } from "./entities/fb-group.entity";
import { FbPostTemplateEntity } from "./entities/fb-post-template.entity";
import { FbGroupType } from "@common/constans/enum.constant";
import { CreateFbGroupDto, UpdateFbGroupDto } from "./dto/fb-group.dto";
import { CreateFbPostTemplateDto, UpdateFbPostTemplateDto } from "./dto/fb-post-template.dto";

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(FbGroupEntity)
    private readonly fbGroupRepository: Repository<FbGroupEntity>,
    @InjectRepository(FbPostTemplateEntity)
    private readonly fbPostTemplateRepository: Repository<FbPostTemplateEntity>
  ) {}

  // Groups
  async findAllGroups(userId: string, page = 1, limit = 10) {
    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const limitNum = Number(limit) > 0 ? Number(limit) : 10;

    const [items, total] = await this.fbGroupRepository.findAndCount({
      where: { userId },
      order: { createdAt: "DESC" },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    return {
      data: items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async createGroup(userId: string, dto: CreateFbGroupDto) {
    const { type, ...rest } = dto;
    const group = this.fbGroupRepository.create({ 
      ...rest, 
      userId,
      type: type as FbGroupType 
    } as any);
    return this.fbGroupRepository.save(group);
  }

  async updateGroup(id: string, userId: string, dto: UpdateFbGroupDto) {
    const group = await this.fbGroupRepository.findOne({ where: { id, userId } });
    if (!group) throw new NotFoundException("Group not found");
    
    const { type, ...rest } = dto;
    if (type) {
      group.type = type as FbGroupType;
    }
    
    Object.assign(group, rest);
    return this.fbGroupRepository.save(group);
  }

  async deleteGroup(id: string, userId: string) {
    const group = await this.fbGroupRepository.findOne({ where: { id, userId } });
    if (!group) throw new NotFoundException("Group not found");
    return this.fbGroupRepository.remove(group);
  }

  // Templates
  async findAllTemplates(userId: string, page = 1, limit = 10) {
    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const limitNum = Number(limit) > 0 ? Number(limit) : 10;

    const [items, total] = await this.fbPostTemplateRepository.findAndCount({
      where: { userId },
      order: { createdAt: "DESC" },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    return {
      data: items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async createTemplate(userId: string, dto: CreateFbPostTemplateDto) {
    const template = this.fbPostTemplateRepository.create({ ...dto, userId });
    return this.fbPostTemplateRepository.save(template);
  }

  async updateTemplate(id: string, userId: string, dto: UpdateFbPostTemplateDto) {
    const template = await this.fbPostTemplateRepository.findOne({ where: { id, userId } });
    if (!template) throw new NotFoundException("Template not found");
    Object.assign(template, dto);
    return this.fbPostTemplateRepository.save(template);
  }

  async deleteTemplate(id: string, userId: string) {
    const template = await this.fbPostTemplateRepository.findOne({ where: { id, userId } });
    if (!template) throw new NotFoundException("Template not found");
    return this.fbPostTemplateRepository.remove(template);
  }
}
