import { Controller, Get, UseGuards } from "@nestjs/common";

import { RequireRole, JwtRbacGuard } from "@tasks/auth";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(JwtRbacGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequireRole("admin")
  async findAll() {
    return this.usersService.findAll();
  }
}
