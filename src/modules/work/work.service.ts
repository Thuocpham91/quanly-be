import { Injectable, NotFoundException, HttpStatus, Logger, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";
import { Work, WorkStatus } from "./work.entity";
import { ObjectEntity, ObjectStatus } from "../object/object.entity";
import { ObjectTask } from "../object/object-task.entity";
import { WorkResponseDto, WorkListResponse, WorkResponse } from "./dto/response/work.response";
import { BaseService } from "@common/services/base.service";
import { CreateWorkDto, UpdateWorkDto, SearchWorkDto, UpdateWorkTaskDto, SearchWorkTaskDto, CreateWorkTaskDto } from "./dto/work.dto";
import { SuccessCode } from "@common/constans/message-code.enum";
import { ObjectResponseDto } from "../object/dto/response/object.response";
import { WorkTask } from "./work-task.entity";
import { WorkTaskHistory } from "./work-task-history.entity";
import { WorkTaskResponseDto } from "./dto/response/work-task.response";
import { OrderResponseDto } from "../order/dto/order-response.dto";
import { plainToInstance, ClassConstructor } from "class-transformer";

@Injectable()
export class WorkService extends BaseService<Work, WorkResponseDto> {
  private readonly logger = new Logger(WorkService.name);

  constructor(
    @InjectRepository(Work)
    private readonly workRepo: Repository<Work>,

    @InjectRepository(ObjectEntity)
    private readonly objectRepo: Repository<ObjectEntity>,
    @InjectRepository(ObjectTask)
    private readonly objectTaskRepo: Repository<ObjectTask>,
    @InjectRepository(WorkTask)
    private readonly workTaskRepo: Repository<WorkTask>,
    @InjectRepository(WorkTaskHistory)
    private readonly workTaskHistoryRepo: Repository<WorkTaskHistory>,
  ) {
    super(workRepo, WorkResponseDto);
  }

  async getAll(): Promise<WorkListResponse> {
    const works = await this.workRepo.find({ relations: ["object", "workTasks", "orders", "orders.user"] });
    return {
      statusCode: HttpStatus.OK,
      data: works.map((item) =>
        this.toDto(item, {
          object: ObjectResponseDto,
          workTasks: WorkTaskResponseDto,
          orders: OrderResponseDto,
        }),
      ),
      message: SuccessCode.SUCCESS,
    };
  }

  async search(params: SearchWorkDto): Promise<WorkListResponse> {
    const filters: Partial<Record<keyof Work, any>> = {};
    if (params.objectId) {
      filters.objectId = params.objectId + "";
    }

    const { data } = await this.searchEntities(
      params.keyword || "",
      ["title", "description"] as (keyof Work)[],
      filters,
      params.page,
      params.limit,
      "id",
      "DESC",
      ["object", "workTasks", "orders", "orders.user"],
      { object: ObjectResponseDto, workTasks: WorkTaskResponseDto, orders: OrderResponseDto },
    );

    return {
      statusCode: HttpStatus.OK,
      data,
      message: SuccessCode.SUCCESS,
    };
  }

  async getById(id: number): Promise<WorkResponse> {
    const work = await this.workRepo.findOne({
      where: { id: id + "" },
      relations: ["object", "workTasks", "orders", "orders.user"],
    });
    if (!work) throw new NotFoundException(`Work with ID ${id} not found`);

    return {
      statusCode: HttpStatus.OK,
      data: this.toDto(work, {
        object: ObjectResponseDto,
        workTasks: WorkTaskResponseDto,
        orders: OrderResponseDto,
      }),
      message: SuccessCode.SUCCESS,
    };
  }

  async createWork(dto: CreateWorkDto): Promise<WorkResponse> {
    // 1. Get the object and its associated tasks
    const object = await this.objectRepo.findOne({ where: { id: dto.objectId + "" } });
    if (!object) throw new NotFoundException(`Object with ID ${dto.objectId} not found`);

    const tasks = await this.objectTaskRepo.find({
      where: { objectId: object.id },
      order: { workDate: "ASC" },
    });

    if (tasks.length === 0) {
      throw new NotFoundException(`No predefined tasks found for Object ${object.name}`);
    }

    // 2. Determine the base reference date
    let baseDate: Date = this.parseCleanDate(dto.startDate || object.startDate);

    // 2.5 Parse workDate from DTO if provided
    let workDateVal: Date | undefined = undefined;
    if (dto.workDate) {
      const rawWorkDate = dto.workDate;
      if (rawWorkDate instanceof Date && !isNaN(rawWorkDate.getTime())) {
        workDateVal = rawWorkDate;
      } else {
        const dateStr = String(rawWorkDate);
        if (dateStr.includes("/")) {
          const [d, m, y] = dateStr.split("/");
          workDateVal = new Date(`${y}-${m}-${d}`);
        } else {
          workDateVal = new Date(dateStr);
        }
      }
      if (workDateVal && isNaN(workDateVal.getTime())) {
        throw new BadRequestException("Invalid workDate format. Please use YYYY-MM-DD or DD/MM/YYYY");
      }
    }

    const startOffset = Number(dto.startDay || 0);

    // 3. Create the Parent Work entity
    const work = this.workRepo.create({
      title: dto.title,
      description: dto.description,
      objectId: object.id,
      object: object,
      startDate: baseDate,
      startDay: startOffset,
      workDate: workDateVal,
      exportDate: workDateVal
        ? (() => {
            const d = new Date(workDateVal);
            d.setDate(d.getDate() + 21);
            return d;
          })()
        : null,
      quantity: dto.quantity,
      purchaseQuantity: dto.purchaseQuantity,
    });

    const savedWork = await this.workRepo.save(work);

    // 4. Create child WorkTask entities for each predefined Task (Filtered by startDay)
    const filteredTasks = tasks.filter((t) => Number(t.workDate) >= startOffset);

    const workTasks = filteredTasks.map((task) => {
      const taskDate = new Date(baseDate);
      // Adjust date: if we start from Day 10 on baseDate, then Day 15 is baseDate + (15 - 10)
      taskDate.setDate(taskDate.getDate() + (Number(task.workDate) - startOffset));

      return this.workTaskRepo.create({
        workId: savedWork.id,
        work: savedWork,
        taskName: task.taskName,
        description: task.description,
        startDate: taskDate,
        offsetDays: Number(task.workDate),
        quantity: dto.quantity || task.quantity,
        removalCount: task.removalCount,
        feedPerAnimal: task.feedPerAnimal,
        hasEggCount: task.hasEggCount,
      });
    });

    await this.workTaskRepo.save(workTasks);

    // 5. Return the created Work with tasks loaded
    const result = await this.workRepo.findOne({
      where: { id: savedWork.id },
      relations: ["object", "workTasks"],
    });

    this.logger.log(`Work created with ID ${savedWork.id} and ${workTasks.length} tasks`);

    return {
      statusCode: HttpStatus.CREATED,
      data: this.toDto(result, { object: ObjectResponseDto, workTasks: WorkTaskResponseDto }),
      message: SuccessCode.SUCCESS,
    };
  }

  async createWorkTask(
    dto: CreateWorkTaskDto,
  ): Promise<{ statusCode: number; data: WorkTaskResponseDto | null; message: string }> {
    const work = await this.workRepo.findOne({ where: { id: dto.workId + "" } });
    if (!work) throw new NotFoundException(`Work with ID ${dto.workId} not found`);

    const task = this.workTaskRepo.create({
      workId: dto.workId + "",
      taskName: dto.taskName,
      description: dto.description,
      startDate: dto.startDate,
      employeeChecked: false,
      managerChecked: false,
    });

    const savedTask = await this.workTaskRepo.save(task);

    return {
      statusCode: HttpStatus.CREATED,
      data: plainToInstance(WorkTaskResponseDto, savedTask, { excludeExtraneousValues: true }),
      message: SuccessCode.SUCCESS,
    };
  }

  async getWorkTasksByWorkId(
    workId: number,
  ): Promise<{ statusCode: number; data: WorkTaskResponseDto[]; message: string }> {
    const tasks = await this.workTaskRepo.find({
      where: { workId: workId + "" },
      order: { startDate: "ASC" },
    });

    return {
      statusCode: HttpStatus.OK,
      data: plainToInstance(WorkTaskResponseDto, tasks, { excludeExtraneousValues: true }),
      message: SuccessCode.SUCCESS,
    };
  }

  async getWorkTaskById(
    id: number,
  ): Promise<{ statusCode: number; data: WorkTaskResponseDto | null; message: string }> {
    const task = await this.workTaskRepo.findOne({ where: { id: id + "" } });
    if (!task) throw new NotFoundException(`WorkTask with ID ${id} not found`);

    return {
      statusCode: HttpStatus.OK,
      data: plainToInstance(WorkTaskResponseDto, task, { excludeExtraneousValues: true }),
      message: SuccessCode.SUCCESS,
    };
  }

  async updateWorkTask(
    id: number,
    dto: UpdateWorkTaskDto,
    updatedBy?: string
  ): Promise<{ statusCode: number; data: WorkTaskResponseDto | null; message: string }> {
    const task = await this.workTaskRepo.findOne({ where: { id: id + "" } });
    if (!task) throw new NotFoundException(`WorkTask with ID ${id} not found`);

    const histories: WorkTaskHistory[] = [];

    if (dto.quantity !== undefined && dto.quantity !== task.quantity) {
      histories.push(this.workTaskHistoryRepo.create({
        workTaskId: task.id,
        action: 'Cập nhật Số lượng',
        oldValue: task.quantity?.toString() || '0',
        newValue: dto.quantity?.toString() || '0',
        createdBy: updatedBy || 'Hệ thống',
      }));
    }

    if (dto.removalCount !== undefined && dto.removalCount !== task.removalCount) {
      histories.push(this.workTaskHistoryRepo.create({
        workTaskId: task.id,
        action: 'Cập nhật Loại bỏ',
        oldValue: task.removalCount?.toString() || '0',
        newValue: dto.removalCount?.toString() || '0',
        createdBy: updatedBy || 'Hệ thống',
      }));
    }

    if (dto.employeeChecked !== undefined && dto.employeeChecked !== task.employeeChecked) {
      histories.push(this.workTaskHistoryRepo.create({
        workTaskId: task.id,
        action: 'Xác nhận (Nhân viên)',
        oldValue: task.employeeChecked ? 'Đã xác nhận' : 'Chưa xác nhận',
        newValue: dto.employeeChecked ? 'Đã xác nhận' : 'Chưa xác nhận',
        createdBy: updatedBy || 'Hệ thống',
      }));
    }

    if (dto.managerChecked !== undefined && dto.managerChecked !== task.managerChecked) {
      histories.push(this.workTaskHistoryRepo.create({
        workTaskId: task.id,
        action: 'Xác nhận (Quản lý)',
        oldValue: task.managerChecked ? 'Đã xác nhận' : 'Chưa xác nhận',
        newValue: dto.managerChecked ? 'Đã xác nhận' : 'Chưa xác nhận',
        createdBy: updatedBy || 'Hệ thống',
      }));
    }

    Object.assign(task, dto);
    const updatedTask = await this.workTaskRepo.save(task);

    if (histories.length > 0) {
      await this.workTaskHistoryRepo.save(histories);
    }

    return {
      statusCode: HttpStatus.OK,
      data: plainToInstance(WorkTaskResponseDto, updatedTask, { excludeExtraneousValues: true }),
      message: SuccessCode.SUCCESS,
    };
  }

  async getTaskHistory(taskId: number) {
    const histories = await this.workTaskHistoryRepo.find({
      where: { workTaskId: taskId + "" },
      order: { createdAt: "DESC" },
    });

    return {
      statusCode: HttpStatus.OK,
      data: histories,
      message: SuccessCode.SUCCESS,
    };
  }

  async deleteWorkTask(id: number): Promise<{ statusCode: number; data: boolean; message: string }> {
    const task = await this.workTaskRepo.findOne({ where: { id: id + "" } });
    if (!task) throw new NotFoundException(`WorkTask with ID ${id} not found`);

    await this.workTaskRepo.softRemove(task);

    return {
      statusCode: HttpStatus.OK,
      data: true,
      message: SuccessCode.SUCCESS,
    };
  }

  async updateWork(id: number, dto: UpdateWorkDto): Promise<WorkResponse> {
    const work = await this.workRepo.findOne({ where: { id: id + "" } });
    if (!work) throw new NotFoundException(`Work with ID ${id} not found`);

    const oldStartDate = work.startDate;
    const oldStartDay = work.startDay ?? 0;
    Object.assign(work, dto);

    const isStartDateChanged = dto.startDate && new Date(dto.startDate).getTime() !== new Date(oldStartDate!).getTime();
    const isStartDayChanged = dto.startDay !== undefined && Number(dto.startDay) !== oldStartDay;

    // Recalculate exportDate if workDate is updated
    if (dto.workDate) {
      const d = new Date(work.workDate!);
      if (!isNaN(d.getTime())) {
        d.setDate(d.getDate() + 21);
        work.exportDate = d;
      }
    }

    // Sync task dates if startDate or startDay of the Work batch is changed
    if (isStartDateChanged || isStartDayChanged) {
      const newBaseDate = dto.startDate ? this.parseCleanDate(dto.startDate) : this.parseCleanDate(oldStartDate);
      work.startDate = newBaseDate;

      const newStartOffset = dto.startDay !== undefined ? Number(dto.startDay) : oldStartDay;
      work.startDay = newStartOffset;

      const tasks = await this.workTaskRepo.find({ where: { workId: id + "" } });
      for (const t of tasks) {
        const newTaskDate = new Date(newBaseDate);
        newTaskDate.setDate(newTaskDate.getDate() + ((t.offsetDays || 0) - newStartOffset));
        t.startDate = newTaskDate;
      }
      await this.workTaskRepo.save(tasks);
      this.logger.log(`Synced ${tasks.length} task dates for Work ${id} due to startDate/startDay change (startDay: ${newStartOffset})`);
    }

    const updated = await this.workRepo.save(work);
    const updatedWithObject = await this.workRepo.findOne({
      where: { id: id + "" },
      relations: ["object"],
    });
    this.logger.log(`Work updated with ID ${id}`);

    return {
      statusCode: HttpStatus.OK,
      data: this.toDto(updatedWithObject, { object: ObjectResponseDto }),
      message: SuccessCode.SUCCESS,
    };
  }

  async deleteWork(id: number): Promise<WorkResponse> {
    const work = await this.workRepo.findOne({ where: { id: id + "" } });
    if (!work) throw new NotFoundException(`Work with ID ${id} not found`);

    await this.workRepo.softRemove(work);
    this.logger.log(`Work deleted with ID ${id}`);

    return {
      statusCode: HttpStatus.OK,
      data: null,
      message: SuccessCode.SUCCESS,
    };
  }

  async searchTasks(
    params: SearchWorkTaskDto,
  ): Promise<{ statusCode: number; data: WorkTaskResponseDto[]; message: string; pagination: any }> {
    const filters: Partial<Record<keyof WorkTask, any>> = {};
    if (params.workId) filters.workId = params.workId;
    if (params.employeeChecked !== undefined) filters.employeeChecked = params.employeeChecked;
    if (params.managerChecked !== undefined) filters.managerChecked = params.managerChecked;

    if (params.startDate) {
      await this.ensureRecurringTasks(params.startDate);
      filters.startDate = params.startDate;
    }

    const { data, pagination } = await this.searchEntitiesRecursive(
      params.keyword || "",
      ["taskName", "description"] as (keyof WorkTask)[],
      filters,
      this.workTaskRepo,
      WorkTaskResponseDto,
      params.page,
      params.limit,
      "startDate",
      "ASC",
      ["work", "work.object", "work.workTasks"]
    );

    return {
      statusCode: HttpStatus.OK,
      data,
      pagination,
      message: SuccessCode.SUCCESS,
    };
  }

  private async searchEntitiesRecursive<Entity, DTO>(
    keyword: string,
    searchableFields: (keyof Entity)[],
    filters: any,
    repository: Repository<Entity>,
    dtoClass: ClassConstructor<DTO>,
    page?: number,
    limit?: number,
    sortBy: string = "id",
    sortOrder: "ASC" | "DESC" = "ASC",
    relations: string[] = [],
  ): Promise<{ data: DTO[]; pagination: any }> {
    const qb = repository.createQueryBuilder("entity");

    if (relations.length > 0) {
      const joinedRelations = new Set<string>();
      
      relations.forEach((rel) => {
        const parts = rel.split(".");
        if (parts.length > 1) {
          // For nested relations like "work.object"
          const parentRelation = parts[0];
          if (!joinedRelations.has(parentRelation)) {
            qb.leftJoinAndSelect(`entity.${parentRelation}`, parentRelation);
            joinedRelations.add(parentRelation);
          }
          qb.leftJoinAndSelect(`${parentRelation}.${parts[1]}`, parts[1]);
          joinedRelations.add(rel);
        } else {
          // For simple relations like "work"
          if (!joinedRelations.has(rel)) {
            qb.leftJoinAndSelect(`entity.${rel}`, rel);
            joinedRelations.add(rel);
          }
        }
      });
    }

    if (keyword && searchableFields.length) {
      const likeConditions = searchableFields.map((field) => `LOWER(entity.${String(field)}) LIKE LOWER(:keyword)`);
      qb.andWhere(`(${likeConditions.join(" OR ")})`, { keyword: `%${keyword}%` });
    }

    Object.entries(filters).forEach(([field, value]) => {
      if (value !== undefined && value !== null) {
        if (field === "startDate" && typeof value === "string") {
          qb.andWhere(`DATE(entity.${field}) = :${field}`, { [field]: value });
        } else {
          qb.andWhere(`entity.${field} = :${field}`, { [field]: value });
        }
      }
    });

    // 🔹 Filter out tasks from finished objects
    qb.andWhere("object.status != :finishedObjectStatus", { finishedObjectStatus: ObjectStatus.FINISHED });
    
    // 🔹 Filter out tasks from finished works
    qb.andWhere("work.status != :finishedWorkStatus", { finishedWorkStatus: WorkStatus.FINISHED });

    qb.orderBy(`entity.${sortBy}`, sortOrder);

    const pageNum = page && page > 0 ? Number(page) : 1;
    const pageSize = limit && limit > 0 ? Number(limit) : 10;

    const [items, total] = await qb
      .skip((pageNum - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      data: plainToInstance(dtoClass, items, { excludeExtraneousValues: true }),
      pagination: {
        total,
        itemCount: items.length,
        itemsPerPage: pageSize,
        totalPages: Math.ceil(total / pageSize),
        currentPage: pageNum,
      },
    };
  }

  async ensureRecurringTasks(dateStr: string) {
    try {
      const targetDate = new Date(dateStr);
      targetDate.setHours(0, 0, 0, 0);

      // 1. Get active works
      const activeWorks = await this.workRepo.find({
        where: {
          status: Not(WorkStatus.FINISHED)
        }
      });

      for (const work of activeWorks) {
        const workStart = new Date(work.startDate);
        workStart.setHours(0, 0, 0, 0);

        if (targetDate < workStart) continue;

        // 2. Get recurring templates for this work's object
        const recurringTemplates = await this.objectTaskRepo.find({
          where: { objectId: work.objectId, isRecurring: true }
        });

        for (const template of recurringTemplates) {
          // 3. Check if task already exists for this day
          // Using query builder to handle date comparison accurately
          const existing = await this.workTaskRepo.createQueryBuilder("task")
            .where("task.workId = :workId", { workId: work.id })
            .andWhere("task.taskName = :taskName", { taskName: template.taskName })
            .andWhere("DATE(task.startDate) = DATE(:targetDate)", { targetDate })
            .getOne();

          if (!existing) {
            const newTask = this.workTaskRepo.create({
              workId: work.id,
              taskName: template.taskName,
              description: template.description,
              startDate: targetDate,
              isRecurring: true,
              hasEggCount: template.hasEggCount,
              quantity: work.quantity || template.quantity,
              feedPerAnimal: template.feedPerAnimal,
            });
            await this.workTaskRepo.save(newTask);
            this.logger.log(`Auto-generated recurring task "${template.taskName}" for Work ${work.id} on ${dateStr}`);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error ensuring recurring tasks for ${dateStr}:`, error);
    }
  }

  private parseCleanDate(rawDate: any): Date {
    if (!rawDate) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return now;
    }
    if (rawDate instanceof Date && !isNaN(rawDate.getTime())) {
      return new Date(rawDate.getFullYear(), rawDate.getMonth(), rawDate.getDate(), 0, 0, 0);
    }
    const dateStr = String(rawDate);
    if (dateStr.includes("/")) {
      const [day, m, y] = dateStr.split("/").map(Number);
      if (y && m && day) return new Date(y, m - 1, day, 0, 0, 0);
    }
    if (dateStr.includes("-")) {
      const datePart = dateStr.split("T")[0];
      const [y, m, day] = datePart.split("-").map(Number);
      if (y && m && day) return new Date(y, m - 1, day, 0, 0, 0);
    }
    const d = new Date(dateStr);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
  }
}
