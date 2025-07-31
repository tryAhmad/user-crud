import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RouterModule } from '@nestjs/core';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtServices: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtServices.sign(payload),
    };
  }

  async register(userData: any) {
    const user = await this.usersService.findByEmail(userData.email);
    if (user) {
      throw new UnauthorizedException('User already exists');
    }

    const hash = await bcrypt.hash(userData.password, 10);
    const createdUser = await this.usersService.createUser({
      ...userData,
      password: hash,
    });
    const { password, ...result } = createdUser.toObject();
    return {
      message: 'User registered successfully',
      user: result,
    };
  }
}
