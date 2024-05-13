import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { FileInterceptor } from '@nestjs/platform-express';

// Controller responsible for handling company-related HTTP requests
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // Endpoint for retrieving company information by UUID
  @HttpCode(200)
  @Get(':uuidCompany')
  async getCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.companyService.getCompany(uuidCompany);
  }

  // Endpoint for retrieving users associated with a company by UUID
  @HttpCode(200)
  @Get('/user/:uuidCompany')
  async getUserCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.companyService.getUserCompany(uuidCompany);
  }

  // Endpoint for retrieving statistics related to a company by UUID
  @HttpCode(200)
  @Get('/statistique/:uuidCompany')
  async getStatistiqueCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.companyService.getStatistiqueCompany(uuidCompany);
  }

  // Endpoint for creating a new company
  @HttpCode(201)
  @Post()
  async createCompany(@Body() body: any) {
    return this.companyService.createCompany(body);
  }

  // Endpoint for joining a company by company code
  @HttpCode(200)
  @Put('joinCompany/:codeCompany')
  async joinCompany(@Param('codeCompany') codeCompany: string) {
    return this.companyService.joinCompany(codeCompany);
  }

  // Endpoint for uploading company logo by UUID
  @Post('uploadLogo/:uuidCompany')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogoCompany(
    @UploadedFile() file: any,
    @Param('uuidCompany') uuidCompany: string,
  ): Promise<unknown> {
    return this.companyService.uploadLogoCompany(file, uuidCompany);
  }

  // Endpoint for updating company information by UUID
  @HttpCode(200)
  @Put(':uuidCompany')
  async updateCompany(
    @Param('uuidCompany') uuidCompany: string,
    @Body() body: any,
  ) {
    return this.companyService.updateCompany(uuidCompany, body);
  }

  // Endpoint for updating company code by UUID
  @HttpCode(200)
  @Patch('updateCode/:uuidCompany')
  async updateCodeCompany(
    @Param('uuidCompany') uuidCompany: string,
    @Body() body: any,
  ) {
    return this.companyService.updateCodeCompany(uuidCompany, body);
  }

  // Endpoint for deleting a company by UUID
  @HttpCode(204)
  @Delete(':uuidCompany')
  async deleteCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.companyService.deleteCompany(uuidCompany);
  }
}
