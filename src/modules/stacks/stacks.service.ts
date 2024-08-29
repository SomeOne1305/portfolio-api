import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { getDownloadURL, getStorage } from 'firebase-admin/storage';
import { Repository } from 'typeorm';
import { CreateStackDto, EditStackDto } from '../../dtos/stacks.dto';
import { Stack } from '../../entities/stack.entity';

@Injectable()
export class StacksService {
  constructor(
    @InjectRepository(Stack)
    private readonly stackRepository: Repository<Stack>,
  ) {}

  async getStacks() {
    return await this.stackRepository.find();
  }

  async createStack(dto: CreateStackDto) {
    const { icon, name } = dto;
    const bucket = getStorage().bucket('gs://portfolio-3e371.appspot.com');
    const fileType = icon.mimetype.includes('svg')
      ? 'svg'
      : icon.mimetype.split('/')[1];
    const filePath =
      'categories/' + crypto.randomBytes(10).toString('hex') + '.' + fileType;

    const uploadIcon = bucket.file(filePath);
    await uploadIcon.save(icon.buffer);
    const url = await getDownloadURL(uploadIcon);
    return await this.stackRepository.save({
      name,
      icon: url,
    });
  }

  async editStack(id: string, dto: Partial<EditStackDto>) {
    const category = await this.stackRepository.findOne({
      where: { id },
    });
    if (!category)
      throw new NotFoundException(`Stack with ID ${id} is not found`);

    return await this.stackRepository.save(Object.assign(category, dto));
  }

  async deleteStack(id: string) {
    const category = await this.stackRepository.findOne({
      where: { id },
    });
    if (!category)
      throw new NotFoundException(`Stack with ID ${id} is not found`);
    const bucket = getStorage().bucket('gs://portfolio-3e371.appspot.com');
    const file = bucket.file(
      new URL(category?.icon)?.pathname
        ?.split('/o/')?.[1]
        .split('%2F')
        .join('/'),
    );

    await file.delete();
    await this.stackRepository.delete({ id });
    return {
      status: 200,
      message: 'Deleted successfully',
    };
  }
}
