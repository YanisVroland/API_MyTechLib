import { Controller, HttpCode, Param, Post } from '@nestjs/common';
import { CopyService } from './copy.service';

@Controller('copy')
export class CopyController {
  constructor(private readonly copyService: CopyService) {}

  @HttpCode(201)
  @Post('createCopyLibrary/:uuidLibrary')
  async createCopyLibrary(@Param('uuidLibrary') uuidLibrary: string) {
    return this.copyService.createCopyLibrary(uuidLibrary);
  }

  @HttpCode(200)
  @Post('useCopyLibrary/:codeStr')
  async useCopyLibrary(@Param('codeStr') codeStr: string) {
    return this.copyService.useCopyLibrary(codeStr);
  }
}
