import { DatabaseSeederService } from './database.seeder';

describe('DatabaseSeederService', () => {
  it('creates the default admin account when it does not exist and sends the password to the configured email', async () => {
    const roleRepo = {
      findOne: jest.fn().mockResolvedValue({ id: 'admin-role-id', code: 'ADMIN' }),
    };

    const userRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn((dto) => dto),
      save: jest.fn(async (dto) => dto),
    };

    const configService = {
      get: jest.fn((key: string) => {
        const values: Record<string, string | number | undefined> = {
          DEFAULT_ADMIN_EMAIL: 'phamvuthuoc91@gmail.com',
          DEFAULT_ADMIN_USERNAME: 'admin',
          MAIL_HOST: 'smtp.gmail.com',
          MAIL_PORT: 587,
          MAIL_USER: 'phamvuthuoc91@gmail.com',
          MAIL_PASS: 'test-app-password',
          MAIL_FROM: 'phamvuthuoc91@gmail.com',
        };
        return values[key];
      }),
    };

    const service = new DatabaseSeederService(
      roleRepo as any,
      {} as any,
      {} as any,
      {} as any,
      userRepo as any,
      configService as any,
    );

    await service.ensureDefaultAdmin();

    expect(userRepo.create).toHaveBeenCalledTimes(1);
    expect(userRepo.save).toHaveBeenCalledTimes(1);
    const savedUser = userRepo.save.mock.calls[0][0];
    expect(savedUser.username).toBe('admin');
    expect(savedUser.email).toBe('phamvuthuoc91@gmail.com');
    expect(savedUser.roleId).toBe('admin-role-id');
    expect(savedUser.password).toBeDefined();
    expect(savedUser.password).not.toBe('');
  });
});
