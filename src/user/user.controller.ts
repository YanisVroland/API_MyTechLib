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

  /**
   * Endpoint for user authentication.
   * @param body Object containing user email and password.
   * @returns Object containing user UUID, access token, and refresh token.
   */
  @HttpCode(200)
  @Post('auth')
  async auth(@Body() body: any) {
    return this.userService.auth(body.email, body.password);
  }

  /**
   * Endpoint for user registration.
   * @param body Object containing user registration data.
   * @returns The newly registered user object.
   */
  @HttpCode(201)
  @Post('registration')
  async registration(@Body() body: any) {
    return this.userService.registration(body);
  }

  /**
   * Endpoint for handling forgot password requests.
   * @param body Object containing user email for password reset.
   * @returns Object confirming email has been sent for password reset.
   */
  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(@Body() body: any) {
    return this.userService.sendPasswordResetEmail(body);
  }

  /**
   * Endpoint for retrieving user information by UUID.
   * @param uuid The UUID of the user.
   * @returns The user object.
   */
  @HttpCode(200)
  @Get(':uuid')
  async getUser(@Param('uuid') uuid: string) {
    return this.userService.getUser(uuid);
  }

  /**
   * Endpoint for allowing a user to leave a company.
   * @param uuidUser The UUID of the user to leave the company.
   * @returns Object confirming user has left the company.
   */
  @HttpCode(200)
  @Patch('leaveCompany/:uuidUser')
  async leaveCompany(@Param('uuidUser') uuidUser: string) {
    return this.userService.leaveCompany(uuidUser);
  }

  /**
   * Endpoint for setting a user as a company admin.
   * @param body Object containing list of user UUIDs.
   * @param boolean The value to set for company admin status.
   * @returns Object confirming users' admin status has been updated.
   */
  @HttpCode(200)
  @Put('setCompanyAdmin/:boolean')
  async setCompanyAdmin(@Body() body: any, @Param('boolean') boolean: boolean) {
    return this.userService.setCompanyAdmin(body, boolean);
  }

  /**
   * Endpoint for updating user information by UUID.
   * @param uuidUser The UUID of the user to update.
   * @param body The data to update for the user.
   * @returns The updated user object.
   */
  @HttpCode(200)
  @Put(':uuidUser')
  async updateUser(@Param('uuidUser') uuidUser: string, @Body() body: any) {
    return this.userService.updateUser(uuidUser, body);
  }

  /**
   * Endpoint for uploading user profile image by UUID.
   * @param file The image file to upload.
   * @param uuidUser The UUID of the user.
   * @returns The updated user object with profile image URL.
   */
  @Post('uploadImageProfile/:uuidUser')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageProfile(
    @UploadedFile() file: any,
    @Param('uuidUser') uuidUser: string,
  ): Promise<unknown> {
    return this.userService.uploadImageProfile(file, uuidUser);
  }
}
