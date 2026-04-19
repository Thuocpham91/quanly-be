import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "../modules/role/role.entity";

@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
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
}
