import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AppDataSource } from "./data-source";

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options), UsersModule],
})
export class AppModule {}
