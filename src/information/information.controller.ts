import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { InformationService } from './information.service';

@Controller('information')
export class InformationController {
  constructor(private readonly informationService: InformationService) {}

  @HttpCode(200)
  @Get('byCompany/:uuidCompany')
  async getInformationByCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.informationService.getInformationByCompany(uuidCompany);
  }

  @HttpCode(200)
  @Get(':uuidInformation')
  async getOneInformation(@Param('uuidInformation') uuidInformation: string) {
    return this.informationService.getOneInformation(uuidInformation);
  }

  @HttpCode(201)
  @Post()
  async createInformation(@Body() body: any) {
    console.log('body');
    return this.informationService.createInformation(body);
  }

  @HttpCode(204)
  @Delete(':uuidInformation')
  async deleteInformation(@Param('uuidInformation') uuidInformation: string) {
    return this.informationService.deleteInformation(uuidInformation);
  }
}
