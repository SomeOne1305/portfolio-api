import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Storage } from 'firebase-admin/lib/storage/storage';
import { getDownloadURL, getStorage } from 'firebase-admin/storage';
import { In, Repository } from 'typeorm';
import { BUCKET_NAME } from '../../constants/storage.constant';
import { CreateProjectDto, UpdateProjectDto } from '../../dtos/project.dto';
import { Project } from '../../entities/project.entity';
import { Stack } from '../../entities/stack.entity';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class ProjectsService {
  private bucket: Storage;
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(Stack)
    private stackRepository: Repository<Stack>,
    private firebaseApp: FirebaseService,
  ) {
    this.bucket = firebaseApp.getStorage();
  }

  async getAllProjects() {
    return await this.projectRepository.find({ relations: ['stacks'] });
  }

  async create(dto: CreateProjectDto, file: Express.Multer.File) {
    const { categories, ...others } = dto;

    const bucket = this.bucket.bucket(BUCKET_NAME);
    const fileType = file.mimetype.includes('svg')
      ? 'svg'
      : file.mimetype.split('/')[1];
    const filePath =
      'projects/' + crypto.randomBytes(10).toString('hex') + '.' + fileType;
    const uploadFile = bucket.file(filePath);
    await uploadFile.save(file.buffer);
    const url = await getDownloadURL(uploadFile);

    const stacks = await this.stackRepository.find({
      where: { id: In(categories.split(',')) },
    });
    return await this.projectRepository.save({
      ...others,
      imgUrl: url,
      stacks: stacks,
    });
  }

  async editProject(
    id: string,
    body: UpdateProjectDto,
    file: Express.Multer.File | undefined,
  ) {
    const { categories, ...others } = body;
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project)
      throw new NotFoundException(`Project with ID ${id} is not found`);
    let url = project.imgUrl;
    if (file) {
      const bucket = getStorage().bucket('gs://portfolio-3e371.appspot.com');
      const oldFile = bucket.file(
        new URL(project?.imgUrl)?.pathname
          ?.split('/o/')?.[1]
          .split('%2F')
          .join('/'),
      );

      await oldFile.delete();
      const fileType = file?.mimetype?.includes('svg')
        ? 'svg'
        : file?.mimetype?.split('/')?.[1];

      const newFileName =
        'projects/' + crypto.randomBytes(10).toString('hex') + '.' + fileType;
      const newFile = bucket.file(newFileName);
      await newFile.save(file.buffer);
      url = await getDownloadURL(newFile);
    }
    let stacks = project.stacks;
    if (categories) {
      stacks = await this.stackRepository.find({
        where: { id: In(categories.split(',')) },
      });
    }
    const newProject = Object.assign(project, {
      ...others,
      imgUrl: url,
      stacks: stacks,
    });
    return await this.projectRepository.save(newProject);
  }
  async deleteProject(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
    });
    if (!project)
      throw new NotFoundException(`Project with ID ${id} is not found`);
    const bucket = getStorage().bucket('gs://portfolio-3e371.appspot.com');
    const file = bucket.file(
      new URL(project?.imgUrl)?.pathname
        ?.split('/o/')?.[1]
        .split('%2F')
        .join('/'),
    );

    await file.delete();
    await this.projectRepository.delete({ id });
    return {
      status: 200,
      message: 'Deleted successfully',
    };
  }
}
