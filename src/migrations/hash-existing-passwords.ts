import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../modules/user/user.entity";
import * as bcrypt from "bcrypt";

/**
 * Migration script to hash all plain-text passwords in existing users
 * Run once: ts-node src/migrations/hash-existing-passwords.ts
 */
async function hashExistingPasswords() {
  const app = await NestFactory.create(AppModule);

  const userRepo = app.get(Repository) as Repository<User>;

  // Get all users
  const users = await userRepo
    .createQueryBuilder("user")
    .addSelect("user.password")
    .getMany();

  let hashedCount = 0;

  for (const user of users) {
    if (!user.password) {
      console.log(`Skipping user ${user.id}: no password`);
      continue;
    }

    // Check if already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
    if (user.password.startsWith("$2")) {
      console.log(`Skipping user ${user.id} (${user.username}): already hashed`);
      continue;
    }

    // Hash the plain-text password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    await userRepo.save(user);

    console.log(`✓ Hashed password for user ${user.id} (${user.username})`);
    hashedCount++;
  }

  console.log(`\n✅ Migration complete! Hashed ${hashedCount} passwords.`);
  await app.close();
}

hashExistingPasswords();
