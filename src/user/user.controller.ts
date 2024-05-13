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

// Controller responsible for handling user-related HTTP requests
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoint for user authentication
  @HttpCode(200)
  @Post('auth')
  async auth(@Body() body: any) {
    return this.userService.auth(body.email, body.password);
  }

  // Endpoint for user registration
  @HttpCode(201)
  @Post('registration')
  async registration(@Body() body: any) {
    return this.userService.registration(body);
  }

  // Endpoint for handling forgot password requests
  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(@Body() body: any) {
    return this.userService.sendPasswordResetEmail(body);
  }

  // Endpoint for retrieving user information by UUID
  @HttpCode(200)
  @Get(':uuid')
  async getUser(@Param('uuid') uuid: string) {
    return this.userService.getUser(uuid);
  }

  // Endpoint for allowing a user to leave a company
  @HttpCode(200)
  @Patch('leaveCompany/:uuidUser')
  async leaveCompany(@Param('uuidUser') uuidUser: string) {
    return this.userService.leaveCompany(uuidUser);
  }

  // Endpoint for setting a user as a company admin
  @HttpCode(200)
  @Put('setCompanyAdmin/:boolean')
  async setCompanyAdmin(@Body() body: any, @Param('boolean') boolean: boolean) {
    return this.userService.setCompanyAdmin(body, boolean);
  }

  // Endpoint for updating user information by UUID
  @HttpCode(200)
  @Put(':uuidUser')
  async updateUser(@Param('uuidUser') uuidUser: string, @Body() body: any) {
    return this.userService.updateUser(uuidUser, body);
  }

  // Endpoint for uploading user profile image by UUID
  @Post('uploadImageProfile/:uuidUser')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageProfile(
    @UploadedFile() file: any,
    @Param('uuidUser') uuidUser: string,
  ): Promise<unknown> {
    return this.userService.uploadImageProfile(file, uuidUser);
  }
}
