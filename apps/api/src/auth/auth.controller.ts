import { Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  };
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const result = await this.authService.login(
      loginDto.email,
      loginDto.password
    );

    if (!result) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return result;
  }
}
