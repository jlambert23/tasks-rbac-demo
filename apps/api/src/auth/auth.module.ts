import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { JwtService } from "@tasks/auth";
import { User } from "../entity/User";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
