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
import { LibraryService } from './library.service';

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
  async getLibrariesByCompany(@Param('uuidCompany') uuidLibrary: string) {
    return this.libraryService.getLibrariesByCompany(uuidLibrary);
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
}
