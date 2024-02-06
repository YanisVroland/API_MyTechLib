import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @Post('auth')
  async auth(@Body() body: any) {
    return this.userService.auth(body.email, body.password);
  }

  @HttpCode(201)
  @Post('registration')
  async registration(@Body() body: any) {
    return this.userService.registration(body);
  }
}
