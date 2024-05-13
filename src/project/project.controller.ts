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

  /**
   * Endpoint for retrieving project information by UUID.
   * @param uuidProject The UUID of the project.
   * @returns The project object.
   */
  @HttpCode(200)
  @Get(':uuidProject')
  async getProject(@Param('uuidProject') uuidProject: string) {
    return this.projectService.getProject(uuidProject);
  }

  /**
   * Endpoint for retrieving projects by company UUID.
   * @param uuidCompany The UUID of the company.
   * @returns Array of projects associated with the company.
   */
  @HttpCode(200)
  @Get('byCompany/:uuidCompany')
  async getProjectsByCompany(@Param('uuidCompany') uuidCompany: string) {
    return this.projectService.getProjectsByCompany(uuidCompany);
  }

  /**
   * Endpoint for retrieving project by library UUID.
   * @param uuidLibrary The UUID of the library.
   * @returns Array of projects associated with the library.
   */
  @HttpCode(200)
  @Get('byLibrary/:uuidLibrary')
  async getProjectByLibrary(@Param('uuidLibrary') uuidLibrary: string) {
    return this.projectService.getProjectByLibrary(uuidLibrary);
  }

  /**
   * Endpoint for creating a new project.
   * @param body Object containing project data.
   * @returns The newly created project object.
   */
  @HttpCode(201)
  @Post()
  async createProject(@Body() body: any) {
    return this.projectService.createProject(body);
  }

  /**
   * Endpoint for updating project information by UUID.
   * @param uuidProject The UUID of the project to update.
   * @param body The data to update for the project.
   * @returns The updated project object.
   */
  @HttpCode(200)
  @Patch(':uuidProject')
  async updateProject(
    @Param('uuidProject') uuidProject: string,
    @Body() body: any,
  ) {
    return this.projectService.updateProject(uuidProject, body);
  }

  /**
   * Endpoint for uploading project logo by UUID.
   * @param file The image file to upload as the project logo.
   * @param uuidProject The UUID of the project.
   * @returns The updated project object with the logo URL.
   */
  @Post('uploadLogo/:uuidProject')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogoProject(
    @UploadedFile() file: any,
    @Param('uuidProject') uuidProject: string,
  ): Promise<unknown> {
    return this.projectService.uploadLogoProject(file, uuidProject);
  }

  /**
   * Endpoint for uploading project illustrations by UUID.
   * @param files Array of image files to upload as project illustrations.
   * @param uuidProject The UUID of the project.
   * @returns The updated project object with the illustrations URLs.
   */
  @Post('uploadIllustrations/:uuidProject')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadIllustrations(
    @UploadedFiles() files: any[],
    @Param('uuidProject') uuidProject: string,
  ): Promise<unknown> {
    return this.projectService.uploadIllustrations(files, uuidProject);
  }

  /**
   * Endpoint for uploading a single project illustration by UUID.
   * @param file The image file to upload as a project illustration.
   * @param uuidProject The UUID of the project.
   * @returns The URL of the uploaded illustration.
   */
  @Post('uploadIllustration/:uuidProject')
  @UseInterceptors(FileInterceptor('file'))
  async uploadIllustration(
    @UploadedFile() file: any,
    @Param('uuidProject') uuidProject: string,
  ): Promise<unknown> {
    return this.projectService.uploadIllustration(file, uuidProject);
  }

  /**
   * Endpoint for uploading project APK file by UUID.
   * @param file The APK file to upload for the project.
   * @param uuidProject The UUID of the project.
   * @returns The updated project object with the APK URL.
   */
  @Post('uploadApk/:uuidProject')
  @UseInterceptors(FileInterceptor('file'))
  async uploadApkProject(
    @UploadedFile() file: any,
    @Param('uuidProject') uuidProject: string,
  ): Promise<unknown> {
    return this.projectService.uploadApkProject(file, uuidProject);
  }

  /**
   * Endpoint for deleting a project by UUID.
   * @param uuidProject The UUID of the project to delete.
   * @returns No content if successful.
   */
  @HttpCode(204)
  @Delete(':uuidProject')
  async deleteProject(@Param('uuidProject') uuidProject: string) {
    return this.projectService.deleteProject(uuidProject);
  }
}
