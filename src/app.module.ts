import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { CategoriesModule } from './modules/categories/categories.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { BudgetModule } from './modules/budget/budget.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    // Global configuration setup
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    // Async collection injection using configService
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    CategoriesModule,
    TransactionsModule,
    BudgetModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}