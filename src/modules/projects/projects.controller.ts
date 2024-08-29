import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProjectDto, UpdateProjectDto } from '../../dtos/project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('all')
  @UseInterceptors(CacheInterceptor)
  async getProjects() {
    return await this.projectsService.getAllProjects();
  }

  @Post('create')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Upload a project with a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Project data and file upload',
    type: CreateProjectDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async createProject(
    @Body() body: CreateProjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.projectsService.create(body, file);
  }
  @Put('edit/:id')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Update the project' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ required: false, type: UpdateProjectDto })
  @UseInterceptors(FileInterceptor('file'))
  async editProject(
    @Body() body: UpdateProjectDto,
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File | undefined,
  ) {
    const { file, ...others } = Object.assign(body, { file: image });
    return await this.projectsService.editProject(id, others, file);
  }

  @Delete('delete/:id')
  async deleteProject(@Param('id') id: string) {
    return await this.projectsService.deleteProject(id);
  }
}
