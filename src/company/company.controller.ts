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

  /**
   * Endpoint for retrieving company information by UUID.
   * @param uuidCompany The UUID of the company to retrieve information for.
   * @returns The company information.
   */
  @HttpCode(200)
  @Get(':uuidCompany')
  async getCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.companyService.getCompany(uuidCompany);
  }

  /**
   * Endpoint for retrieving users associated with a company by UUID.
   * @param uuidCompany The UUID of the company to retrieve users for.
   * @returns The list of users associated with the company.
   */
  @HttpCode(200)
  @Get('/user/:uuidCompany')
  async getUserCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.companyService.getUserCompany(uuidCompany);
  }

  /**
   * Endpoint for retrieving statistics related to a company by UUID.
   * @param uuidCompany The UUID of the company to retrieve statistics for.
   * @returns The statistics related to the company.
   */
  @HttpCode(200)
  @Get('/statistique/:uuidCompany')
  async getStatistiqueCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.companyService.getStatistiqueCompany(uuidCompany);
  }

  /**
   * Endpoint for creating a new company.
   * @param body The request body containing company information.
   * @returns The newly created company.
   */
  @HttpCode(201)
  @Post()
  async createCompany(@Body() body: any) {
    return this.companyService.createCompany(body);
  }

  /**
   * Endpoint for joining a company by company code.
   * @param codeCompany The code of the company to join.
   * @returns The result of the company joining process.
   */
  @HttpCode(200)
  @Put('joinCompany/:codeCompany')
  async joinCompany(@Param('codeCompany') codeCompany: string) {
    return this.companyService.joinCompany(codeCompany);
  }

  /**
   * Endpoint for uploading company logo by UUID.
   * @param file The logo file to upload.
   * @param uuidCompany The UUID of the company to upload the logo for.
   * @returns The result of the logo upload process.
   */
  @Post('uploadLogo/:uuidCompany')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogoCompany(
    @UploadedFile() file: any,
    @Param('uuidCompany') uuidCompany: string,
  ): Promise<unknown> {
    return this.companyService.uploadLogoCompany(file, uuidCompany);
  }

  /**
   * Endpoint for updating company information by UUID.
   * @param uuidCompany The UUID of the company to update information for.
   * @param body The request body containing updated company information.
   * @returns The updated company information.
   */
  @HttpCode(200)
  @Put(':uuidCompany')
  async updateCompany(
    @Param('uuidCompany') uuidCompany: string,
    @Body() body: any,
  ) {
    return this.companyService.updateCompany(uuidCompany, body);
  }

  /**
   * Endpoint for updating company code by UUID.
   * @param uuidCompany The UUID of the company to update the code for.
   * @param body The request body containing the new company code.
   * @returns The result of the company code update process.
   */
  @HttpCode(200)
  @Patch('updateCode/:uuidCompany')
  async updateCodeCompany(
    @Param('uuidCompany') uuidCompany: string,
    @Body() body: any,
  ) {
    return this.companyService.updateCodeCompany(uuidCompany, body);
  }

  /**
   * Endpoint for deleting a company by UUID.
   * @param uuidCompany The UUID of the company to delete.
   * @returns The result of the company deletion process.
   */
  @HttpCode(204)
  @Delete(':uuidCompany')
  async deleteCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.companyService.deleteCompany(uuidCompany);
  }
}
