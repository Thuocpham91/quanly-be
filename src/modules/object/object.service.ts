import { Injectable, NotFoundException, HttpStatus, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { plainToInstance } from "class-transformer";
import { ObjectEntity } from "./object.entity";
import { ObjectTask } from "./object-task.entity";
import { ObjectResponseDto, ObjectListResponse, ObjectResponse } from "./dto/response/object.response";
import { ObjectTaskResponseDto, ObjectTaskListResponse, ObjectTaskResponse } from "./dto/response/object-task.response";
import { BaseService } from "@common/services/base.service";
import { CreateObjectDto, UpdateObjectDto } from "./dto/object.dto";
import { CreateObjectTaskDto } from "./dto/object-task.dto";
import { SuccessCode } from "@common/constans/message-code.enum";

@Injectable()
export class ObjectService extends BaseService<ObjectEntity, ObjectResponseDto> {
  private readonly logger = new Logger(ObjectService.name);

  constructor(
    @InjectRepository(ObjectEntity)
    private readonly objectRepo: Repository<ObjectEntity>,
    @InjectRepository(ObjectTask)
    private readonly taskRepo: Repository<ObjectTask>,
  ) {
    super(objectRepo, ObjectResponseDto);
  }

  async getAll(): Promise<ObjectListResponse> {
    const objects = await this.objectRepo.find();
    return {
      statusCode: HttpStatus.OK,
      data: objects.map((item) => this.toDto(item)),
      message: SuccessCode.SUCCESS,
    };
  }

  async getById(id: number): Promise<ObjectResponse> {
    const object = await this.objectRepo.findOne({ where: { id: id + "" } });
    if (!object) throw new NotFoundException(`Object with ID ${id} not found`);

    return {
      statusCode: HttpStatus.OK,
      data: this.toDto(object),
      message: SuccessCode.SUCCESS,
    };
  }

  async createObject(dto: CreateObjectDto): Promise<ObjectResponse> {
    const object = this.objectRepo.create(dto);
    const saved = await this.objectRepo.save(object);
    this.logger.log(`Object created with ID ${saved.id}`);

    return {
      statusCode: HttpStatus.CREATED,
      data: this.toDto(saved),
      message: SuccessCode.SUCCESS,
    };
  }

  async updateObject(id: number, dto: UpdateObjectDto): Promise<ObjectResponse> {
    const object = await this.objectRepo.findOne({ where: { id: id + "" } });
    if (!object) throw new NotFoundException(`Object with ID ${id} not found`);

    Object.assign(object, dto);
    const updated = await this.objectRepo.save(object);
    this.logger.log(`Object updated with ID ${id}`);

    return {
      statusCode: HttpStatus.OK,
      data: this.toDto(updated),
      message: SuccessCode.SUCCESS,
    };
  }

  async deleteObject(id: number): Promise<ObjectResponse> {
    const object = await this.objectRepo.findOne({ where: { id: id + "" } });
    if (!object) throw new NotFoundException(`Object with ID ${id} not found`);

    await this.objectRepo.remove(object);
    this.logger.log(`Object deleted with ID ${id}`);

    return {
      statusCode: HttpStatus.OK,
      data: null,
      message: SuccessCode.SUCCESS,
    };
  }

  async getTasks(objectId: number): Promise<ObjectTaskListResponse> {
    const object = await this.objectRepo.findOne({ where: { id: objectId + "" } });
    if (!object) throw new NotFoundException(`Object with ID ${objectId} not found`);

    const tasks = await this.taskRepo.find({
      where: { objectId: object.id },
      order: { workDate: "DESC" },
    });

    const scheduledTasks = tasks.map((task) => {
      let scheduledDate: Date | null = null;
      if (object.startDate) {
        scheduledDate = new Date(object.startDate);
        scheduledDate.setDate(scheduledDate.getDate() + Number(task.workDate));
      }

      return {
        ...task,
        scheduledDate,
      };
    });

    return {
      statusCode: HttpStatus.OK,
      data: plainToInstance(ObjectTaskResponseDto, scheduledTasks, { excludeExtraneousValues: true }),
      message: SuccessCode.SUCCESS,
    };
  }

  async addTask(objectId: number, dto: CreateObjectTaskDto): Promise<ObjectTaskResponse> {
    const object = await this.objectRepo.findOne({ where: { id: objectId + "" } });
    if (!object) throw new NotFoundException(`Object with ID ${objectId} not found`);

    const task = this.taskRepo.create({
      ...dto,
      object,
      objectId: object.id,
    });

    const saved = await this.taskRepo.save(task);

    return {
      statusCode: HttpStatus.CREATED,
      data: plainToInstance(ObjectTaskResponseDto, saved, { excludeExtraneousValues: true }),
      message: SuccessCode.SUCCESS,
    };
  }

  async updateTask(objectId: number, taskId: string, dto: any): Promise<ObjectTaskResponse> {
    const task = await this.taskRepo.findOne({ where: { id: taskId, objectId: objectId + "" } });
    if (!task) throw new NotFoundException(`Task with ID ${taskId} not found for this object`);

    Object.assign(task, dto);
    const updated = await this.taskRepo.save(task);

    return {
      statusCode: HttpStatus.OK,
      data: plainToInstance(ObjectTaskResponseDto, updated, { excludeExtraneousValues: true }),
      message: SuccessCode.SUCCESS,
    };
  }

  async deleteTask(objectId: number, taskId: string): Promise<ObjectTaskResponse> {
    const task = await this.taskRepo.findOne({ where: { id: taskId, objectId: objectId + "" } });
    if (!task) throw new NotFoundException(`Task with ID ${taskId} not found for this object`);

    await this.taskRepo.remove(task);

    return {
      statusCode: HttpStatus.OK,
      data: null,
      message: SuccessCode.SUCCESS,
    };
  }
}
