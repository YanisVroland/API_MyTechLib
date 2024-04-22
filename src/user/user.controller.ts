import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @HttpCode(200)
  @Patch('leaveCompany/:uuidUser')
  async leaveCompany(@Param('uuidUser') uuidUser: string) {
    return this.userService.leaveCompany(uuidUser);
  }

  @HttpCode(200)
  @Put(':uuidUser')
  async updateUser(@Param('uuidUser') uuidUser: string, @Body() body: any) {
    return this.userService.updateUser(uuidUser, body);
  }

  @Post('uploadImageProfile/:uuidUser')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageProfile(
    @UploadedFile() file: any,
    @Param('uuidUser') uuidUser: string,
  ): Promise<unknown> {
    return this.userService.uploadImageProfile(file, uuidUser);
  }
}
