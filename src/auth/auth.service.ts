import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}
  async SignUp(createAuthDto: CreateAuthDto) {
  const hashedPassword = await this.hashPassword(createAuthDto.password)
  return await this.userService.create({...createAuthDto,password:hashedPassword})
  }

  private async hashPassword(password:string):Promise<string>{
    const saltRound = this.configService.get<number>('SALT_ROUND');
    const salt = await bcrypt.genSalt(+saltRound)
    return await bcrypt.hash(password,salt)

  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
