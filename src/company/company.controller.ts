import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @HttpCode(200)
  @Get(':uuidCompany')
  async getCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.companyService.getCompany(uuidCompany);
  }

  @HttpCode(200)
  @Get('/user/:uuidCompany')
  async getUserCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.companyService.getUserCompany(uuidCompany);
  }

  @HttpCode(201)
  @Post()
  async createCompany(@Body() body: any) {
    return this.companyService.createCompany(body);
  }

  @Post('upload/:uuidCompany')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogoCompany(
    @UploadedFile() file: any,
    @Param('uuidCompany') uuidCompany: string,
  ): Promise<unknown> {
    return this.companyService.uploadLogoCompany(file, uuidCompany);
  }

  @HttpCode(200)
  @Patch(':uuidCompany')
  async updateCompany(
    @Param('uuidCompany') uuidCompany: string,
    @Body() body: any,
  ) {
    return this.companyService.updateCompany(uuidCompany, body);
  }

  @HttpCode(204)
  @Delete(':uuidCompany')
  async deleteCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.companyService.deleteCompany(uuidCompany);
  }
}
