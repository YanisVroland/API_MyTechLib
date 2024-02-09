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
import { ProjectService } from './project.service';

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

  @HttpCode(204)
  @Delete(':uuidProject')
  async deleteProject(@Param('uuidProject') uuidProject: string) {
    return this.projectService.deleteProject(uuidProject);
  }
}
