import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "../modules/role/role.entity";
import { ChickenPrice } from "../modules/chicken-price/chicken-price.entity";
import { ObjectEntity, ObjectType, ObjectStatus } from "../modules/object/object.entity";
import { ObjectTask } from "../modules/object/object-task.entity";
import * as XLSX from 'xlsx';

@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeederService.name);
  private defaultObjectId: string;

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(ChickenPrice)
    private readonly chickenPriceRepo: Repository<ChickenPrice>,
    @InjectRepository(ObjectEntity)
    private readonly objectRepo: Repository<ObjectEntity>,
    @InjectRepository(ObjectTask)
    private readonly objectTaskRepo: Repository<ObjectTask>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
    // await this.seedObjects();
    // await this.seedObjectTasks();
  }

  private async seedRoles(): Promise<void> {
    const defaultRoles = [
      {
        code: "ADMIN",
        name: "Administrator",
        description: "Administrative user with full access",
        isActive: true,
      },
      {
        code: "MANAGER",
        name: "Manager",
        description: "Manager user with limited administrative access",
        isActive: true,
      },
      {
        code: "USER",
        name: "User",
        description: "Regular user with basic access",
        isActive: true,
      },
    ];

    for (const roleData of defaultRoles) {
      const existingRole = await this.roleRepo.findOne({
        where: { code: roleData.code },
      });

      if (!existingRole) {
        const role = this.roleRepo.create(roleData);
        await this.roleRepo.save(role);
        this.logger.log(`✓ Created default role: ${roleData.code}`);
      } else {
        this.logger.debug(`Role ${roleData.code} already exists, skipping`);
      }
    }

    this.logger.log("✓ Database seeding completed");
  }

  private async seedObjects(): Promise<void> {
    try {
      // Check if any object exists for chickens
      let object = await this.objectRepo.findOne({
        where: { type: ObjectType.VAO_GA },
      });

      if (!object) {
        const objectData = {
          name: 'Gà con - Chăm sóc từ ngày 1',
          startDate: new Date(),
          description: 'Nhóm gà con trong quy trình chăm sóc từ ngày 1',
          type: ObjectType.VAO_GA,
          quantity: 100,
          status: ObjectStatus.ACTIVE,
        };

        object = this.objectRepo.create(objectData);
        await this.objectRepo.save(object);
        this.logger.log(`✓ Created object: ${objectData.name}`);
      } else {
        this.logger.debug(`Object with type VAO_GA already exists, using existing one`);
      }

      this.defaultObjectId = object.id;
      this.logger.log(`✓ Using object id: ${this.defaultObjectId}`);
    } catch (error) {
      this.logger.error("Error seeding objects:", error);
    }
  }

  private async seedObjectTasks(): Promise<void> {
    try {
      if (!this.defaultObjectId) {
        this.logger.error("Default object ID not set, skipping object task seeding");
        return;
      }

      const workbook = XLSX.readFile('lich_ga_FULL_CHUAN_TRAI.xlsx');
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      for (const row of data) {
        // Map Excel columns to ObjectTask fields
        const ngay = row['Ngày'];
        const camGCon = row['Cám (g/con)'];
        const trLuong = row['Trọng lượng (g)'];
        
        // Skip rows without required data
        if (!ngay) {
          this.logger.warn(`Skipping invalid row: ${JSON.stringify(row)}`);
          continue;
        }

        const taskData = {
          objectId: this.defaultObjectId, // Use the created object's ID
          taskName: `Ngày ${ngay} - Quy trình chăm sóc`,
          quantity: trLuong ? Math.floor(trLuong) : null,
          workDate: ngay,
          removalCount: null,
          description: this.buildDescription(row),
          feedPerAnimal: camGCon ? parseFloat(camGCon) : null,
        };

        const existing = await this.objectTaskRepo.findOne({
          where: { objectId: taskData.objectId, taskName: taskData.taskName },
        });

        if (!existing) {
          const objectTask = this.objectTaskRepo.create(taskData);
          await this.objectTaskRepo.save(objectTask);
          this.logger.log(`✓ Created object task: ${taskData.taskName}`);
        } else {
          this.logger.debug(`Object task ${taskData.taskName} already exists, skipping`);
        }
      }

      this.logger.log("✓ Object task seeding completed");
    } catch (error) {
      this.logger.error("Error seeding object tasks:", error);
    }
  }

  private buildDescription(row: any): string {
    const parts = [];
    
    if (row['Cám (g/con)']) parts.push(`<p>Cám: ${row['Cám (g/con)']}g/con</p>`);
    if (row['Trọng lượng (g)']) parts.push(`<p>Trọng lượng: ${row['Trọng lượng (g)']}g</p>`);
    if (row['Uống sáng']) parts.push(`<p>Uống sáng: ${row['Uống sáng']}</p>`);
    if (row['Uống chiều']) parts.push(`<p>Uống chiều: ${row['Uống chiều']}</p>`);
    if (row['Liều dùng']) parts.push(`<p>Liều dùng: ${row['Liều dùng']}</p>`);
    if (row['Canxi']) parts.push(`<p>Canxi: ${row['Canxi']}</p>`);
    if (row['D3']) parts.push(`<p>D3: ${row['D3']}</p>`);
    if (row['Vaccine']) parts.push(`<p>Vaccine: ${row['Vaccine']}</p>`);
    if (row['Phòng E.coli']) parts.push(`<p>Phòng E.coli: ${row['Phòng E.coli']}</p>`);
    if (row['Phòng cầu trùng']) parts.push(`<p>Phòng cầu trùng: ${row['Phòng cầu trùng']}</p>`);
    if (row['Phòng tụ huyết trùng']) parts.push(`<p>Phòng tụ huyết trùng: ${row['Phòng tụ huyết trùng']}</p>`);

    return parts.length > 0 ? parts.join('') : '<p>loại trứng ko phôi</p>';
  }
}
