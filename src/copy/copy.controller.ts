import { Controller, HttpCode, Param, Post } from '@nestjs/common';
import { CopyService } from './copy.service';

// Controller responsible for handling copy-related HTTP requests
@Controller('copy')
export class CopyController {
  constructor(private readonly copyService: CopyService) {}

  // Endpoint for creating a copy of a library by UUID
  @HttpCode(201) // Set HTTP status code to 201 (Created)
  @Post('createCopyLibrary/:uuidLibrary') // Endpoint URL: /copy/createCopyLibrary/:uuidLibrary
  async createCopyLibrary(@Param('uuidLibrary') uuidLibrary: string) {
    return this.copyService.createCopyLibrary(uuidLibrary);
  }

  // Endpoint for using a copy of a library by code string
  @HttpCode(200) // Set HTTP status code to 200 (OK)
  @Post('useCopyLibrary/:codeStr') // Endpoint URL: /copy/useCopyLibrary/:codeStr
  async useCopyLibrary(@Param('codeStr') codeStr: string) {
    return this.copyService.useCopyLibrary(codeStr);
  }
}
