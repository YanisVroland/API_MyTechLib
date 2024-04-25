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

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @HttpCode(200)
  @Get(':uuidLibrary')
  async getLibrary(@Param('uuidLibrary') uuidLibrary: string) {
    return this.libraryService.getLibrary(uuidLibrary);
  }

  @HttpCode(200)
  @Get('byCompany/:uuidCompany')
  async getLibrariesByCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.libraryService.getLibrariesByCompany(uuidCompany);
  }

  @HttpCode(200)
  @Get('byUser/:uuidUser')
  async getLibrariesByUser(@Param('uuidUser') uuidUser: string) {
    return this.libraryService.getLibrariesByUser(uuidUser);
  }

  @HttpCode(201)
  @Post()
  async createLibrary(@Body() body: any) {
    return this.libraryService.createLibrary(body);
  }

  @HttpCode(200)
  @Patch(':uuidLibrary')
  async updateLibrary(
    @Param('uuidLibrary') uuidLibrary: string,
    @Body() body: any,
  ) {
    return this.libraryService.updateLibrary(uuidLibrary, body);
  }

  @HttpCode(204)
  @Delete(':uuidLibrary')
  async deleteLibrary(@Param('uuidLibrary') uuidLibrary: string) {
    return this.libraryService.deleteLibrary(uuidLibrary);
  }

  @Post('uploadLogo/:uuidLibrary')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogoLibrary(
    @UploadedFile() file: any,
    @Param('uuidLibrary') uuidLibrary: string,
  ): Promise<unknown> {
    return this.libraryService.uploadLogoLibrary(file, uuidLibrary);
  }

  @Post('uploadBanner/:uuidLibrary')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBannerLibrary(
    @UploadedFile() file: any,
    @Param('uuidLibrary') uuidLibrary: string,
  ): Promise<unknown> {
    return this.libraryService.uploadBannerLibrary(file, uuidLibrary);
  }
}
