import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @HttpCode(200)
  @Get('byCompany/:uuidCompany')
  async getNotificationByCompany(@Param('uuidCompany') uuidCompany: string) {
    console.log('uuidCompany', uuidCompany);
    return this.notificationService.getNotificationByCompany(uuidCompany);
  }

  @HttpCode(200)
  @Get(':uuidNotification')
  async getOneNotification(
    @Param('uuidNotification') uuidNotification: string,
  ) {
    return this.notificationService.getOneNotification(uuidNotification);
  }

  @HttpCode(201)
  @Post()
  async createNotification(@Body() body: any) {
    return this.notificationService.createNotification(body);
  }

  @HttpCode(204)
  @Delete(':uuidNotification')
  async deleteNotification(
    @Param('uuidNotification') uuidNotification: string,
  ) {
    return this.notificationService.deleteNotification(uuidNotification);
  }
}
