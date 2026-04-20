import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { DATABASE_URL } from 'src/common/constant/app.constant';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {

    try {
      const url = new URL(DATABASE_URL as string);
      console.log('✅ Prisma: Parsing database URL successfully');

      const adapter = new PrismaMariaDb({
        user: url.username,
        password: url.password,
        host: url.hostname,
        port: Number(url.port),
        database: url.pathname.substring(1),
      });

      super({ adapter });
    } catch (error) {
      console.error('❌ Error parsing DATABASE_URL:', error);
      throw error;
    }
  }

  async onModuleInit() {
    try {
      await this.$queryRaw`SELECT 1+1 AS result`;
      console.log('✅ [PRISMA] Connection has been established successfully.');
    } catch (error) {
      console.error('❌ Unable to connect to the database:', error);
      throw error;
    }
  }
}
