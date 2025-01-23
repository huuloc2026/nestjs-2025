import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/module/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateAuthDto } from 'src/auth/dto';
import { randomUUID } from 'crypto';
import { NotFoundError } from 'rxjs';
import { ROLE } from 'src/module/user/enum/EUser';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  async createNewUser(createUserDto: Partial<User>): Promise<User> {
    const data = { ...createUserDto };
    const newUser = await this.userRepo.save(data);
    return newUser;
  }

  async findOneByCondition(condition: any) {
    const property = await this.userRepo.findOne({
      where: { ...condition },
    });
    if (!property) throw new NotFoundException('Can Not find');
    return property;
  }

  async findOnebyId(id: string) {
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

  async findEmailNotExist(email: string): Promise<boolean> {
    const property = await this.userRepo.findOne({
      where: { email },
    });
    return !!property;
  }

  async updateInfor(User: UpdateUserDto, SomethingUpdate:any): Promise<any> {
    const ExistUser = await this.userRepo.findOne({
      where: { email: User.email },
      select: {
        fullName: true,
        address: true,
        Avatar: true,
        dateOfBirth: true,
        gender: true,
        phoneNumber: true,
      },
    });
    //console.log(ExistUser);
    const newInfor = { ...ExistUser, ...SomethingUpdate };
    console.log(newInfor);

    // const { id, email, role } = User;
    // return { id, email, role };
  }

  async GetInforFromField(email: string, field: any) {
    // const GetUserInfor = await this.userRepo.findOne({where:{email}
    //   ,select: {field:true}})
  }

  async GetUserWithRole(emailInput: string): Promise<any> {
    const User = await this.findOnebyEmail(emailInput);
    const { id, email, role } = User;
    return { id, email, role };
  }

  async setCurrentRefreshToken(id: string, hashed_token: string) {
    const property = await this.findOnebyId(id);
    return this.userRepo.save({
      ...property,
      refreshToken: hashed_token,
    });
  }

  async update(id: string, updateUserDto: Partial<User>): Promise<User> {
    const property = await this.findOnebyId(id);
    return this.userRepo.save({
      ...property,
      ...updateUserDto,
    });
  }

  async findOne(id: string): Promise<User> {
    const userExist = await this.userRepo.findOne({ where: { id } });
    if (!userExist) {
      throw new NotFoundException(`Not found user with ${id}`);
    }
    return userExist;
  }
  async findAll() {
    return await this.userRepo.findAndCount();
  }
  async remove(id: string) {
    return await this.userRepo.delete(id);
  }
}
