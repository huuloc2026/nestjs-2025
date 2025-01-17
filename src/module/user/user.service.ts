import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/module/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAuthDto } from 'src/auth/dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  async create(createUserDto: CreateAuthDto) {
    const newUser = await this.userRepo.save(createUserDto);
    return newUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOnebyId(id: number) {
    const property = await this.userRepo.findOne({
      where: { id },
    });
    if (!property) throw new HttpException(`Can not find user by ${id}`, 401);
    return property;
  }
  async findOnebyEmail(email: string): Promise<User> {
    const property = await this.userRepo.findOne({
      where: { email },
    });
    if (!property) throw new HttpException(`Can not find user by ${email}`, 401);
    return property;
  }

  async update(id: number, updateUserDto: Partial<User>) {
    const property = await this.findOnebyId(id);
    return this.userRepo.save({
      ...property,
      ...updateUserDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
