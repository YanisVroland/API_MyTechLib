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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @HttpCode(200)
  @Get(':uuidProject')
  async getProject(@Param('uuidProject') uuidProject: string) {
    return this.projectService.getProject(uuidProject);
  }

  @HttpCode(200)
  @Get('byCompany/:uuidCompany')
  async getProjectsByCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.projectService.getProjectsByCompany(uuidCompany);
  }

  @HttpCode(200)
  @Get('byLibrary/:uuidLibrary')
  async getProjectByLibrary(@Param('uuidLibrary') uuidLibrary: string) {
    return this.projectService.getProjectByLibrary(uuidLibrary);
  }

  @HttpCode(201)
  @Post()
  async createProject(@Body() body: any) {
    return this.projectService.createProject(body);
  }

  @HttpCode(200)
  @Patch(':uuidProject')
  async updateProject(
    @Param('uuidProject') uuidProject: string,
    @Body() body: any,
  ) {
    return this.projectService.updateProject(uuidProject, body);
  }

  @Post('uploadLogo/:uuidProject')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogoProject(
    @UploadedFile() file: any,
    @Param('uuidProject') uuidProject: string,
  ): Promise<unknown> {
    return this.projectService.uploadLogoProject(file, uuidProject);
  }

  @Post('uploadIllustrations/:uuidProject')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadIllustrations(
    @UploadedFiles() files: any[],
    @Param('uuidProject') uuidProject: string,
  ): Promise<unknown> {
    return this.projectService.uploadIllustrations(files, uuidProject);
  }

  @Post('uploadApk/:uuidProject')
  @UseInterceptors(FileInterceptor('file'))
  async uploadApkProject(
    @UploadedFile() file: any,
    @Param('uuidProject') uuidProject: string,
  ): Promise<unknown> {
    return this.projectService.uploadApkProject(file, uuidProject);
  }

  @HttpCode(204)
  @Delete(':uuidProject')
  async deleteProject(@Param('uuidProject') uuidProject: string) {
    return this.projectService.deleteProject(uuidProject);
  }
}
