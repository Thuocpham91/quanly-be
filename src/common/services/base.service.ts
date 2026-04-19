import { getMetadataArgsStorage, Repository, SelectQueryBuilder } from "typeorm";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { CustomHttpException } from "@common/exceptions/custom-http.exception";
import { ErrorCode, SuccessCode } from "@common/constans/message-code.enum";
import { HttpException, HttpStatus, Logger } from "@nestjs/common";
import { PaginationMeta, PaginationOptions } from "@common/dtos/paginated-response.dto";
import { randomUUID } from "crypto";

export class BaseService<T, R> {
  constructor(
    protected readonly repo: Repository<T>,
    protected readonly responseDto: new (...args: any[]) => R, // Class DTO dùng để mapping entity → DTO
  ) {}

  /**
   * Chuyển 1 entity thành DTO, map các quan hệ 1 level dựa trên relationDtoMap
   * @param entity Entity cần map
   * @param relationDtoMap Map relation property → DTO class
   * @returns DTO của entity
   */
  protected toDto(entity: T, relationDtoMap?: Record<string, ClassConstructor<any>>): R {
    const dto = plainToInstance(this.responseDto, entity, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    if (relationDtoMap) {
      const entityTarget = (entity as any).constructor;
      const relations = getMetadataArgsStorage().relations.filter((rel) => rel.target === entityTarget);

      for (const [relationKey, RelationDto] of Object.entries(relationDtoMap)) {
        const relationMeta = relations.find((rel) => rel.propertyName === relationKey);
        const relationValue = (entity as any)[relationKey];

        if (relationValue) {
          if (relationMeta?.relationType === "one-to-many" || relationMeta?.relationType === "many-to-many") {
            // Map mảng quan hệ
            (dto as any)[relationKey] = relationValue.map((rel: any) =>
              plainToInstance(RelationDto, rel, { excludeExtraneousValues: true, enableImplicitConversion: true }),
            );
          } else {
            // Map quan hệ đơn
            (dto as any)[relationKey] = plainToInstance(RelationDto, relationValue, {
              excludeExtraneousValues: true,
              enableImplicitConversion: true,
            });
          }
        }
      }
    }

    return dto;
  }

  /**
   * Chuyển 1 entity thành DTO, hỗ trợ map quan hệ nested nhiều cấp theo path
   * @param entity Entity cần map
   * @param responseDto DTO class cho entity gốc
   * @param relationDtoMap Map quan hệ (có thể nested: "locations.services.service.classifies")
   * @returns DTO đã map quan hệ nested
   */
  protected toDtoRecursive<T, R>(
    entity: T,
    responseDto: ClassConstructor<R>,
    relationDtoMap?: Record<string, ClassConstructor<any>>,
  ): R {
    if (!entity) return null as any;

    const dto = plainToInstance(responseDto, entity, {
      excludeExtraneousValues: true,
    });

    if (relationDtoMap) {
      for (const [relationPath, RelationDto] of Object.entries(relationDtoMap)) {
        const keys = relationPath.split(".");
        this.applyRelation(dto, entity, keys, RelationDto);
      }
    }

    return dto;
  }

  /**
   * Chuyển 1 danh sách entity thành danh sách DTO 1 level
   */
  protected toDtos = (entities: T[], relationDtoMap?: Record<string, ClassConstructor<any>>): R[] => {
    return entities.map((entity) => this.toDto(entity, relationDtoMap));
  };

  /**
   * Chuyển 1 danh sách entity thành danh sách DTO, hỗ trợ quan hệ nested nhiều cấp
   */
  protected toDtosRecursive<T, R>(
    entities: T[],
    responseDto: ClassConstructor<R>,
    relationDtoMap?: Record<string, ClassConstructor<any>>,
  ): R[] {
    if (!entities || entities.length === 0) return [];
    return entities.map((entity) => this.toDtoRecursive(entity, responseDto, relationDtoMap));
  }

  /**
   * Build standardized API response for single entity
   * @param entity Entity to convert to DTO
   * @param relationDtoMap Optional relation mapping for nested DTOs
   * @param message Optional success message (defaults to SUCCESS)
   * @returns Standardized response object
   */
  protected buildSingleResponse(
    entity: T,
    relationDtoMap?: Record<string, ClassConstructor<any>>,
    message: string = SuccessCode.SUCCESS,
  ): { data: R; message: string } {
    return {
      data: this.toDtoRecursive(entity, this.responseDto, relationDtoMap),
      message,
    };
  }

  /**
   * Build standardized API response for list of entities
   * @param entities Entities to convert to DTOs
   * @param relationDtoMap Optional relation mapping for nested DTOs
   * @param message Optional success message (defaults to SUCCESS)
   * @returns Standardized response object
   */
  protected buildListResponse(
    entities: T[],
    relationDtoMap?: Record<string, ClassConstructor<any>>,
    message: string = SuccessCode.SUCCESS,
  ): { data: R[]; message: string } {
    return {
      data: this.toDtosRecursive(entities, this.responseDto, relationDtoMap),
      message,
    };
  }

  /**
   * Build standardized API response with pagination
   * @param entities Entities to convert to DTOs
   * @param pagination Pagination metadata
   * @param relationDtoMap Optional relation mapping for nested DTOs
   * @param message Optional success message (defaults to SUCCESS)
   * @returns Standardized paginated response object
   */
  protected buildPaginatedResponse(
    entities: T[],
    pagination: PaginationMeta,
    relationDtoMap?: Record<string, ClassConstructor<any>>,
    message: string = SuccessCode.SUCCESS,
  ): { data: R[]; pagination: PaginationMeta; message: string } {
    return {
      data: this.toDtosRecursive(entities, this.responseDto, relationDtoMap),
      pagination,
      message,
    };
  }

  /**
   * Hàm đệ quy áp dụng mapping quan hệ nested theo keys
   * @param dto DTO hiện tại
   * @param entity Entity hiện tại
   * @param keys Mảng các property path còn lại
   * @param RelationDto DTO class của quan hệ hiện tại
   */
  private applyRelation(dto: any, entity: any, keys: string[], RelationDto: ClassConstructor<any>) {
    if (!entity) return;

    const [currentKey, ...restKeys] = keys;
    if (!currentKey) return;

    const entityValue = entity[currentKey];
    if (!entityValue) return;

    if (restKeys.length === 0) {
      // Cuối path → map entity → RelationDto
      if (Array.isArray(entityValue)) {
        dto[currentKey] = entityValue.map((item) =>
          plainToInstance(RelationDto, item, { excludeExtraneousValues: true }),
        );
      } else {
        dto[currentKey] = plainToInstance(RelationDto, entityValue, {
          excludeExtraneousValues: true,
        });
      }
    } else {
      // Chưa tới cuối path → đệ quy
      if (Array.isArray(entityValue)) {
        dto[currentKey] = entityValue.map((item, index) => {
          const subDto = dto[currentKey]?.[index] ?? {};
          this.applyRelation(subDto, item, restKeys, RelationDto);
          return subDto;
        });
      } else {
        dto[currentKey] = dto[currentKey] ?? {};
        this.applyRelation(dto[currentKey], entityValue, restKeys, RelationDto);
      }
    }
  }

  /**
   * Phân trang danh sách entity, trả về DTO 1 level
   */
  async paginate(
    qb: SelectQueryBuilder<T>,
    options: PaginationOptions,
    relationDtoMap?: Record<string, ClassConstructor<any>>,
  ): Promise<{ data: R[]; pagination: PaginationMeta }> {
    const page = Number(options.page) && Number(options.page) > 0 ? Number(options.page) : 1;
    const limit = Number(options.limit) && Number(options.limit) > 0 ? Number(options.limit) : 10;

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: this.toDtos(items, relationDtoMap),
      pagination: {
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
        total: total,
      },
    };
  }

  protected async paginated(
    qb: SelectQueryBuilder<T>,
    options: PaginationOptions,
  ): Promise<{ data: T[]; pagination: PaginationMeta }> {
    const page = Number(options.page) && Number(options.page) > 0 ? Number(options.page) : 1;
    const limit = Number(options.limit) && Number(options.limit) > 0 ? Number(options.limit) : 10;

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Phân trang danh sách entity, trả về DTO hỗ trợ nested relation (dùng toDtosRecursive)
   */
  async paginateWithNestedRelations(
    qb: SelectQueryBuilder<T>,
    options: PaginationOptions,
    relationDtoMap?: Record<string, ClassConstructor<any>>,
  ): Promise<{ data: R[]; pagination: PaginationMeta }> {
    const page = Number(options.page) && Number(options.page) > 0 ? Number(options.page) : 1;
    const limit = Number(options.limit) && Number(options.limit) > 0 ? Number(options.limit) : 10;

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: this.toDtosRecursive(items, this.responseDto, relationDtoMap),
      pagination: {
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
        total: total,
      },
    };
  }

  /**
   * Phân trang cho các truy vấn raw, trả về dữ liệu thô
   */
  async paginateRaw<U>(
    qb: SelectQueryBuilder<T>,
    options: PaginationOptions,
  ): Promise<{ data: U[]; pagination: PaginationMeta }> {
    const page = Number(options.page) && Number(options.page) > 0 ? Number(options.page) : 1;
    const limit = Number(options.limit) && Number(options.limit) > 0 ? Number(options.limit) : 10;

    // Total
    const totalQuery = qb.clone().select("COUNT(*)", "count");
    (totalQuery as any).expressionMap.orderBys = {}; // bỏ orderBy để tránh lỗi
    const totalResult = await totalQuery.getRawOne<{ count: string }>();
    const total = parseInt(totalResult?.count ?? "0", 10);

    // Data
    const itemsQuery = qb
      .clone()
      .offset((page - 1) * limit)
      .limit(limit);
    const items = await itemsQuery.getRawMany<U>();

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async paginateGroupRaw<U>(
    qb: SelectQueryBuilder<any>,
    options: PaginationOptions,
    groupByField: string,
  ): Promise<{ data: U[]; pagination: PaginationMeta }> {
    const page = Number(options.page) && Number(options.page) > 0 ? Number(options.page) : 1;
    const limit = Number(options.limit) && Number(options.limit) > 0 ? Number(options.limit) : 10;

    // Total (đếm distinct groupByField)
    const totalQuery = qb.clone().select(`COUNT(DISTINCT ${groupByField})`, "count").limit(undefined).offset(undefined);

    (totalQuery as any).expressionMap.groupBys = []; // bỏ groupBy gốc
    (totalQuery as any).expressionMap.orderBys = {}; // bỏ orderBy

    const totalResult = await totalQuery.getRawOne<{ count: string }>();
    const total = parseInt(totalResult?.count ?? "0", 10);

    // Data
    const itemsQuery = qb
      .clone()
      .offset((page - 1) * limit)
      .limit(limit);
    const items = await itemsQuery.getRawMany<U>();

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Tìm kiếm entity theo keyword và filters, hỗ trợ phân trang
   */
  async searchEntities(
    keyword: string,
    searchableFields: (keyof T)[],
    filters: Partial<Record<keyof T, any>> = {},
    page?: number,
    limit?: number,
    sortBy: keyof T = "id" as keyof T,
    sortOrder: "ASC" | "DESC" = "ASC",
    relations: string[] = [],
    relationDtoMap?: Record<string, ClassConstructor<any>>,
  ): Promise<{ data: R[]; pagination: any }> {
    const qb = this.repo.createQueryBuilder("entity");

    // Load relations
    if (relations.length > 0) {
      relations.forEach((rel) => {
        if (rel.includes(".")) {
          const parts = rel.split(".");
          const parentAlias = parts.length > 2 ? parts[parts.length - 2] : parts[0];
          const childProperty = parts[parts.length - 1];
          const alias = rel.replace(/\./g, "_");
          qb.leftJoinAndSelect(`${parentAlias}.${childProperty}`, alias);
        } else {
          qb.leftJoinAndSelect(`entity.${rel}`, rel);
        }
      });
    }

    // Điều kiện keyword LIKE trên các field searchable
    if (keyword && searchableFields.length) {
      const likeConditions = searchableFields.map((field) => `LOWER(entity.${String(field)}) LIKE LOWER(:keyword)`);
      qb.andWhere(`(${likeConditions.join(" OR ")})`, { keyword: `%${keyword}%` });
    }

    // Áp dụng filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value !== undefined && value !== null) {
        qb.andWhere(`entity.${field} = :${field}`, { [field]: value });
      }
    });

    // Sắp xếp
    qb.orderBy(`entity.${String(sortBy)}`, sortOrder);

    const pageNum = page && page > 0 ? page : 1;
    const pageSize = limit && limit > 0 ? limit : 10;

    const [items, total] = await qb
      .skip((pageNum - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      data: this.toDtos(items, relationDtoMap),
      pagination: {
        total: total,
        itemCount: items.length,
        itemsPerPage: pageSize,
        totalPages: Math.ceil(total / pageSize),
        currentPage: pageNum,
      },
    };
  }

  /**
   * Xử lý lỗi chung trong service
   * @param error Lỗi ném ra
   * @throws CustomHttpException hoặc HttpException tương ứng
   */
  protected async handleError(error: any): Promise<never> {
    console.error("ERROR: ", error);

    if (error instanceof CustomHttpException) throw error;
    if (error instanceof HttpException) throw error;

    // Lỗi FK constraint
    if (error.code === "23503") {
      throw new CustomHttpException(
        ErrorCode.RELATION_CONSTRAINT_VIOLATION,
        ErrorCode.RELATION_CONSTRAINT_VIOLATION,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Lỗi trùng dữ liệu
    if (error.code === "23505") {
      throw new CustomHttpException(ErrorCode.DUPLICATE_DATA, ErrorCode.DUPLICATE_DATA, HttpStatus.BAD_REQUEST);
    }

    // Mặc định: lỗi nội bộ
    const code = error?.response?.message ?? error?.message ?? ErrorCode.INTERNAL_SERVER_ERROR;
    throw new CustomHttpException(code, code, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  protected generateCodeWithPrefix(prefix: string): string {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = randomUUID().slice(0, 6).toUpperCase();
    return `${prefix}${datePart}${randomPart}`;
  }
}
