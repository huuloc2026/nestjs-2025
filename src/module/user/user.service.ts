import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/module/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAuthDto } from 'src/auth/dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  async createNewUser(createUserDto:Partial<User>):Promise<User> {
    const data = { ...createUserDto};
    const newUser = await this.userRepo.save(data);
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
    if (!property)
      throw new HttpException(`Can not find user by ${email}`, 401);
    return property;
  }

  async findEmailNotExist(email:string):Promise<boolean>{
    const property = await this.userRepo.findOne({
      where: { email },
    });
    return !!property
  }

  async setCurrentRefreshToken(id: number, hashed_token: string) {
    const property = await this.findOnebyId(id);
    return this.userRepo.save({
      ...property,
      refreshToken: hashed_token,
    });
  }

  async update(id: number, updateUserDto: Partial<User>):Promise<User> {
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
