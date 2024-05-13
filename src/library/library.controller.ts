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
import { LibraryService } from './library.service';
import { FileInterceptor } from '@nestjs/platform-express';

// Controller responsible for handling library-related HTTP requests
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  // Endpoint for retrieving library information by UUID
  @HttpCode(200)
  @Get(':uuidLibrary')
  async getLibrary(@Param('uuidLibrary') uuidLibrary: string) {
    return this.libraryService.getLibrary(uuidLibrary);
  }

  // Endpoint for retrieving libraries by company UUID
  @HttpCode(200)
  @Get('byCompany/:uuidCompany')
  async getLibrariesByCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.libraryService.getLibrariesByCompany(uuidCompany);
  }

  // Endpoint for retrieving libraries by user UUID
  @HttpCode(200)
  @Get('byUser/:uuidUser')
  async getLibrariesByUser(@Param('uuidUser') uuidUser: string) {
    return this.libraryService.getLibrariesByUser(uuidUser);
  }

  // Endpoint for creating a new library
  @HttpCode(201)
  @Post()
  async createLibrary(@Body() body: any) {
    return this.libraryService.createLibrary(body);
  }

  // Endpoint for updating library information by UUID
  @HttpCode(200)
  @Patch(':uuidLibrary')
  async updateLibrary(
    @Param('uuidLibrary') uuidLibrary: string,
    @Body() body: any,
  ) {
    return this.libraryService.updateLibrary(uuidLibrary, body);
  }

  // Endpoint for updating library count of associated projects
  @HttpCode(200)
  @Patch('countProject/:uuidLibrary')
  async updateLibraryCountProject(@Param('uuidLibrary') uuidLibrary: string) {
    return this.libraryService.updateLibraryCountProject(uuidLibrary);
  }

  // Endpoint for deleting a library by UUID
  @HttpCode(204)
  @Delete(':uuidLibrary')
  async deleteLibrary(@Param('uuidLibrary') uuidLibrary: string) {
    return this.libraryService.deleteLibrary(uuidLibrary);
  }

  // Endpoint for uploading library logo by UUID
  @Post('uploadLogo/:uuidLibrary')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogoLibrary(
    @UploadedFile() file: any,
    @Param('uuidLibrary') uuidLibrary: string,
  ): Promise<unknown> {
    return this.libraryService.uploadLogoLibrary(file, uuidLibrary);
  }

  // Endpoint for uploading library banner by UUID
  @Post('uploadBanner/:uuidLibrary')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBannerLibrary(
    @UploadedFile() file: any,
    @Param('uuidLibrary') uuidLibrary: string,
  ): Promise<unknown> {
    return this.libraryService.uploadBannerLibrary(file, uuidLibrary);
  }
}
