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

// Controller responsible for handling project-related HTTP requests
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // Endpoint for retrieving project information by UUID
  @HttpCode(200)
  @Get(':uuidProject')
  async getProject(@Param('uuidProject') uuidProject: string) {
    return this.projectService.getProject(uuidProject);
  }

  // Endpoint for retrieving projects by company UUID
  @HttpCode(200)
  @Get('byCompany/:uuidCompany')
  async getProjectsByCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.projectService.getProjectsByCompany(uuidCompany);
  }

  // Endpoint for retrieving project by library UUID
  @HttpCode(200)
  @Get('byLibrary/:uuidLibrary')
  async getProjectByLibrary(@Param('uuidLibrary') uuidLibrary: string) {
    return this.projectService.getProjectByLibrary(uuidLibrary);
  }

  // Endpoint for creating a new project
  @HttpCode(201)
  @Post()
  async createProject(@Body() body: any) {
    return this.projectService.createProject(body);
  }

  // Endpoint for updating project information by UUID
  @HttpCode(200)
  @Patch(':uuidProject')
  async updateProject(
    @Param('uuidProject') uuidProject: string,
    @Body() body: any,
  ) {
    return this.projectService.updateProject(uuidProject, body);
  }

  // Endpoint for uploading project logo by UUID
  @Post('uploadLogo/:uuidProject')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogoProject(
    @UploadedFile() file: any,
    @Param('uuidProject') uuidProject: string,
  ): Promise<unknown> {
    return this.projectService.uploadLogoProject(file, uuidProject);
  }

  // Endpoint for uploading project illustrations by UUID
  @Post('uploadIllustrations/:uuidProject')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadIllustrations(
    @UploadedFiles() files: any[],
    @Param('uuidProject') uuidProject: string,
  ): Promise<unknown> {
    return this.projectService.uploadIllustrations(files, uuidProject);
  }

  // Endpoint for uploading a single project illustration by UUID
  @Post('uploadIllustration/:uuidProject')
  @UseInterceptors(FileInterceptor('file'))
  async uploadIllustration(
    @UploadedFile() file: any,
    @Param('uuidProject') uuidProject: string,
  ): Promise<unknown> {
    return this.projectService.uploadIllustration(file, uuidProject);
  }

  // Endpoint for uploading project APK file by UUID
  @Post('uploadApk/:uuidProject')
  @UseInterceptors(FileInterceptor('file'))
  async uploadApkProject(
    @UploadedFile() file: any,
    @Param('uuidProject') uuidProject: string,
  ): Promise<unknown> {
    return this.projectService.uploadApkProject(file, uuidProject);
  }

  // Endpoint for deleting a project by UUID
  @HttpCode(204)
  @Delete(':uuidProject')
  async deleteProject(@Param('uuidProject') uuidProject: string) {
    return this.projectService.deleteProject(uuidProject);
  }
}
