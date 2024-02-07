import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
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

  @HttpCode(200)
  @Get(':uuid')
  async getUser(@Param('uuid') uuid: string) {
    return this.userService.getUser(uuid);
  }
}
