// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Loads .env globally
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/nest-demo',
    ),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
