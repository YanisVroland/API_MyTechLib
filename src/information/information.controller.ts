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

// Controller responsible for handling information-related HTTP requests
@Controller('information')
export class InformationController {
  constructor(private readonly informationService: InformationService) {}

  /**
   * Endpoint for retrieving information by company UUID.
   * @param uuidCompany The UUID of the company.
   * @returns Array of information associated with the company.
   */
  @HttpCode(200)
  @Get('byCompany/:uuidCompany')
  async getInformationByCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.informationService.getInformationByCompany(uuidCompany);
  }

  /**
   * Endpoint for retrieving a specific piece of information by UUID.
   * @param uuidInformation The UUID of the information.
   * @returns The information object.
   */
  @HttpCode(200)
  @Get(':uuidInformation')
  async getOneInformation(@Param('uuidInformation') uuidInformation: string) {
    return this.informationService.getOneInformation(uuidInformation);
  }

  /**
   * Endpoint for creating new information.
   * @param body The data for creating the information.
   * @returns The newly created information object.
   */
  @HttpCode(201)
  @Post()
  async createInformation(@Body() body: any) {
    return this.informationService.createInformation(body);
  }

  /**
   * Endpoint for deleting information by UUID.
   * @param uuidInformation The UUID of the information to delete.
   * @returns No content if successful.
   */
  @HttpCode(204)
  @Delete(':uuidInformation')
  async deleteInformation(@Param('uuidInformation') uuidInformation: string) {
    return this.informationService.deleteInformation(uuidInformation);
  }
}
