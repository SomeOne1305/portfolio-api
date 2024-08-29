import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../dtos/user.dto';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';
import { ILang } from '../../interfaces';

export class BotUtils {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async createUser(dto: CreateUserDto) {
    return await this.userRepository.save(dto);
  }
  async getUser(id: number) {
    return await this.userRepository.findOne({ where: { telegram_id: id } });
  }
  async getProjectOneByOne(page: number) {
    const [data, total] = await this.projectRepository.findAndCount({
      relations: ['stacks'],
      skip: page - 1,
      take: 1,
    });

    return { data, total };
  }
  async IsUserAvailable(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { telegram_id: id },
    });
    if (user) {
      return true;
    }
    return false;
  }
  async setUserLang(id: number, lang: ILang) {
    return await this.userRepository.update({ telegram_id: id }, { lang });
  }
}
