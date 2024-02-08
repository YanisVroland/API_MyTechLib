import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @HttpCode(200)
  @Get(':uuidCompany')
  async getCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.companyService.getCompany(uuidCompany);
  }

  @HttpCode(200)
  @Get()
  async getAllCompanies() {
    return this.companyService.getAllCompanies();
  }

  @HttpCode(201)
  @Post()
  async createCompany(@Body() body: any) {
    return this.companyService.createCompany(body);
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
