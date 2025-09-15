import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reflector } from "@nestjs/core";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User } from "../entity/User";
import { JwtService, JwtRbacGuard } from "@tasks/auth";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, JwtService, JwtRbacGuard, Reflector],
  exports: [UsersService],
})
export class UsersModule {}
