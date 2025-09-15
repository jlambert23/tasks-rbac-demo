import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { JwtService } from "@tasks/auth";
import { User } from "../entity/User";
import { LoginResponse } from "./auth.controller";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string): Promise<LoginResponse | null> {
    const user = await this.userRepository.findOne({
      where: { firstName: email }, // Using firstName as a demo "email"
      relations: ["role", "role.children"],
    });

    if (!user) {
      return null;
    }

    const token = this.jwtService.generateToken({
      id: user.id,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
      },
    };
  }
}
